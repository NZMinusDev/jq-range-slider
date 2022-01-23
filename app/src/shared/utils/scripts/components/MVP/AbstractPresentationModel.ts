import defaultsDeep from 'lodash-es/defaultsDeep';

import EventManagerMixin from '../EventManagerMixin/EventManagerMixin';
import IFacadeModel from './IFacadeModel';

type AbstractPresentationModelEvents<
  TOptions extends Required<Record<string, unknown>>,
  TState extends Required<Record<string, unknown>>
> = {
  set: { options: TOptions; state: TState };
  response: { state: Partial<TState> };
};

abstract class AbstractPresentationModel<
  TOptions extends Record<string, unknown>,
  TNormalizedOptions extends Required<TOptions>,
  TState extends Record<string, unknown>,
  TFacadeModel extends IFacadeModel<Partial<TState>>
> extends EventManagerMixin<
  AbstractPresentationModelEvents<TNormalizedOptions, Required<TState>>
> {
  protected _options: TNormalizedOptions;

  protected _state: Required<TState>;

  protected readonly _theOrderOfIteratingThroughTheOptions: Extract<
    keyof Required<TOptions>,
    string
  >[];

  protected readonly _theOrderOfIteratingThroughTheState: Extract<
    keyof Required<TState>,
    string
  >[];

  protected _optionsShouldBeFixed: Extract<keyof Required<TOptions>, string>[];

  protected _stateShouldBeFixed: Extract<keyof Required<TState>, string>[];

  protected _facadeModel: TFacadeModel | null;

  constructor(
    DEFAULT_OPTIONS: Required<TOptions>,
    DEFAULT_STATE: Required<TState>,
    {
      options,
      state,
      theOrderOfIteratingThroughTheOptions = [],
      theOrderOfIteratingThroughTheState = [],
      facadeModel,
    }: {
      options?: Partial<TOptions>;
      state?: Partial<TState>;
      theOrderOfIteratingThroughTheOptions?: Extract<
        keyof Required<TOptions>,
        string
      >[];
      theOrderOfIteratingThroughTheState?: Extract<keyof TState, string>[];
      facadeModel?: TFacadeModel;
    } = {}
  ) {
    super();

    const fullOptions = defaultsDeep({}, options, DEFAULT_OPTIONS);
    const fullState = defaultsDeep({}, state, DEFAULT_STATE);

    type OptionsKey = Extract<keyof TOptions, string>;
    type StateKey = Extract<keyof TState, string>;
    this._theOrderOfIteratingThroughTheOptions = [
      ...new Set([
        ...theOrderOfIteratingThroughTheOptions,
        ...Object.keys(fullOptions),
      ] as OptionsKey[]),
    ];
    this._theOrderOfIteratingThroughTheState = [
      ...new Set([
        ...theOrderOfIteratingThroughTheState,
        ...Object.keys(fullState),
      ] as StateKey[]),
    ];

    this._optionsShouldBeFixed = [
      ...this._theOrderOfIteratingThroughTheOptions,
    ];
    this._stateShouldBeFixed = [...this._theOrderOfIteratingThroughTheState];
    ({ validOptions: this._options, validState: this._state } = this._validate(
      fullOptions,
      fullState
    ));

    this._facadeModel = null;
    if (facadeModel !== undefined) {
      this.setFacadeModel(facadeModel);
    }
  }

  getOptions() {
    const options: Record<string, unknown> = {};

    this._eachSelf(
      this._theOrderOfIteratingThroughTheOptions,
      '_get',
      'Option',
      (key, nameOfExistingMethod) => {
        // just js trick
        options[key] = (this as any)[nameOfExistingMethod]();
      }
    );

    return options as TNormalizedOptions;
  }

  setOptions(options?: Partial<TOptions>) {
    const sortedKeys = AbstractPresentationModel._getSortedKeys(
      this._options,
      this._theOrderOfIteratingThroughTheOptions,
      options
    );

    this._eachSelf(
      sortedKeys,
      '_set',
      'Option',
      (key, nameOfExistingMethod) => {
        const valueToPass = options && options[key];

        // just js trick
        (this as any)[nameOfExistingMethod](valueToPass);
      }
    );

    ({ validOptions: this._options, validState: this._state } = this._validate(
      this._options,
      this._state
    ));

    this._emitSet();

    return this;
  }

  getState() {
    const state: Record<string, unknown> = {};

    this._eachSelf(
      this._theOrderOfIteratingThroughTheState,
      '_get',
      'State',
      (key, nameOfExistingMethod) => {
        // just js trick
        state[key] = (this as any)[nameOfExistingMethod]();
      }
    );

    return state as Required<TState>;
  }

  setState(state?: Partial<TState>) {
    const sortedKeys = AbstractPresentationModel._getSortedKeys(
      this._state,
      this._theOrderOfIteratingThroughTheState,
      state
    );

    this._eachSelf(sortedKeys, '_set', 'State', (key, nameOfExistingMethod) => {
      const valueToPass = state && state[key];

      // just js trick
      (this as any)[nameOfExistingMethod](valueToPass);
    });

    ({ validOptions: this._options, validState: this._state } = this._validate(
      this._options,
      this._state
    ));

    this._emitSet();

    return this;
  }

  setFacadeModel(model: TFacadeModel) {
    if (this._facadeModel !== null) {
      this._facadeModel.closeConnections();
    }

    this._facadeModel = model;
    this._bindFacadeModelListeners();

    return this._facadeModel.getState().then((state) => {
      this.setState(state);

      return state;
    });
  }

  sendState() {
    this._facadeModel?.setState(this._state);

    return this;
  }

  protected _validate(options: TOptions, state: Required<TState>) {
    const validOptions = this._validateOptions(options);
    const validState = this._validateState(validOptions, state);

    return { validOptions, validState };
  }

  protected _validateOptions(options: TOptions) {
    let validOptions = {} as TNormalizedOptions;

    this._optionsShouldBeFixed = [...new Set(this._optionsShouldBeFixed)];

    this._optionsShouldBeFixed = AbstractPresentationModel._sortKeys(
      this._optionsShouldBeFixed,
      this._theOrderOfIteratingThroughTheOptions
    );

    this._eachSelf(
      this._optionsShouldBeFixed,
      '_fix',
      'Option',
      (key, nameOfExistingMethod) => {
        validOptions = {
          ...validOptions,
          // just js trick
          [key]: (this as any)[nameOfExistingMethod]({
            ...options,
            ...validOptions,
          })[key],
        };
      }
    );

    this._optionsShouldBeFixed.length = 0;

    return { ...options, ...validOptions };
  }

  protected _validateState(
    options: TNormalizedOptions,
    state: Required<TState>
  ) {
    let validState = {} as Required<TState>;

    this._stateShouldBeFixed = [...new Set(this._stateShouldBeFixed)];

    this._stateShouldBeFixed = AbstractPresentationModel._sortKeys(
      this._stateShouldBeFixed,
      this._theOrderOfIteratingThroughTheState
    );

    this._eachSelf(
      this._stateShouldBeFixed,
      '_fix',
      'State',
      (key, nameOfExistingMethod) => {
        validState = {
          ...validState,
          // just js trick
          [key]: (this as any)[nameOfExistingMethod](options, {
            ...state,
            ...validState,
          })[key],
        };
      }
    );

    this._stateShouldBeFixed.length = 0;

    return { ...state, ...validState };
  }

  protected _emitSet() {
    this.trigger('set', { options: this.getOptions(), state: this.getState() });

    return this;
  }

  protected _bindFacadeModelListeners() {
    this._facadeModel?.whenStateIsChanged(
      this._facadeModelEventListenerObject.handleFacadeModelChange
    );
  }

  protected _facadeModelEventListenerObject = {
    handleFacadeModelChange: (state: Partial<TState>) => {
      this.setState(state);
      this.trigger('response', { state });
    },
  };

  protected _eachSelf<TKeys extends string[]>(
    sortedKeys: TKeys,
    prefix: string,
    postfix: string,
    callback: (key: TKeys[number], nameOfExistingMethod: string) => unknown
  ) {
    sortedKeys.forEach((key) => {
      const [theFirstLetter] = key;
      const theRestLetters = key.slice(1);
      const methodName = `${prefix}${
        theFirstLetter.toUpperCase() + theRestLetters
      }${postfix}`;

      // just js trick
      if ((this as any)[methodName] !== undefined) {
        callback(key, methodName);
      }
    });

    return this;
  }

  protected static _getSortedKeys<
    TRequiredRecord extends Required<Record<string, unknown>>,
    TPartialRecord extends Partial<Record<string, unknown>>
  >(
    required: TRequiredRecord,
    orderProvider: Extract<keyof TRequiredRecord, string>[],
    partial?: TPartialRecord
  ) {
    const keys = Object.keys(partial ?? required);

    return AbstractPresentationModel._sortKeys(keys, orderProvider);
  }

  protected static _sortKeys<TKeys extends string[]>(
    keys: TKeys,
    orderProvider: string[]
  ) {
    const copy = [...keys];

    return copy.sort(
      (a, b) => orderProvider.indexOf(a) - orderProvider.indexOf(b)
    );
  }
}

export {
  AbstractPresentationModel as default,
  AbstractPresentationModelEvents,
};
