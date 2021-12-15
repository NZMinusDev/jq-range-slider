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

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);
    this._state = defaultsDeep({}, state, DEFAULT_STATE);

    type OptionsKey = Extract<keyof TOptions, string>;
    type StateKey = Extract<keyof TState, string>;
    this._theOrderOfIteratingThroughTheOptions = [
      ...new Set([
        ...theOrderOfIteratingThroughTheOptions,
        ...Object.keys(this._options),
      ] as OptionsKey[]),
    ];
    this._theOrderOfIteratingThroughTheState = [
      ...new Set([
        ...theOrderOfIteratingThroughTheState,
        ...Object.keys(this._state),
      ] as StateKey[]),
    ];

    this._optionsShouldBeFixed = [
      ...this._theOrderOfIteratingThroughTheOptions,
    ];
    this._stateShouldBeFixed = [...this._theOrderOfIteratingThroughTheState];
    this._validate();

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
      (key, methodName) => {
        // just js trick
        options[key] = (this as any)[methodName]();
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

    this._eachSelf(sortedKeys, '_set', 'Option', (key, methodName) => {
      // just js trick
      if ((this as any)[methodName] !== undefined) {
        const valueToPass = options && options[key];

        // just js trick
        (this as any)[methodName](valueToPass);
      }
    });

    this._validate();

    this._emitSet();

    return this;
  }

  getState() {
    const state: Record<string, unknown> = {};

    this._eachSelf(
      this._theOrderOfIteratingThroughTheState,
      '_get',
      'State',
      (key, methodName) => {
        // just js trick
        if ((this as any)[methodName] !== undefined) {
          // just js trick
          state[key] = (this as any)[methodName]();
        }
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

    this._eachSelf(sortedKeys, '_set', 'State', (key, methodName) => {
      // just js trick
      if ((this as any)[methodName] !== undefined) {
        const valueToPass = state && state[key];

        // just js trick
        (this as any)[methodName](valueToPass);
      }
    });

    this._validate();

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

  protected _validate() {
    this._validateOptions()._validateState();

    return this;
  }

  protected _validateOptions() {
    this._optionsShouldBeFixed = [...new Set(this._optionsShouldBeFixed)];

    AbstractPresentationModel._sortKeys(
      this._optionsShouldBeFixed,
      this._theOrderOfIteratingThroughTheOptions
    );

    this._eachSelf(
      this._optionsShouldBeFixed,
      '_fix',
      'Option',
      (key, methodName) => {
        // just js trick
        (this as any)[methodName]();
      }
    );

    this._optionsShouldBeFixed.length = 0;

    return this;
  }

  protected _validateState() {
    this._stateShouldBeFixed = [...new Set(this._stateShouldBeFixed)];

    AbstractPresentationModel._sortKeys(
      this._stateShouldBeFixed,
      this._theOrderOfIteratingThroughTheState
    );

    this._eachSelf(
      this._stateShouldBeFixed,
      '_fix',
      'State',
      (key, methodName) => {
        // just js trick
        (this as any)[methodName]();
      }
    );

    this._stateShouldBeFixed.length = 0;

    return this;
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
    callback: (key: TKeys[number], methodName: string) => unknown
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
    return AbstractPresentationModel._sortKeys(
      Object.keys(partial ?? required),
      orderProvider
    );
  }

  protected static _sortKeys(keys: string[], orderProvider: string[]) {
    return keys.sort(
      (a, b) => orderProvider.indexOf(a) - orderProvider.indexOf(b)
    );
  }
}

export {
  AbstractPresentationModel as default,
  AbstractPresentationModelEvents,
};
