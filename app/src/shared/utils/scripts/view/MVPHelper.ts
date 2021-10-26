import { html, render, TemplateResult } from 'lit-html';
import { ClassInfo } from 'lit-html/directives/class-map';
import { StyleInfo } from 'lit-html/directives/style-map';
import defaultsDeep from 'lodash-es/defaultsDeep';

import EventManagerMixin from './EventManagerMixin';

type Template = (
  attributes?: {
    classInfo?: ClassInfo;
    styleInfo?: StyleInfo;
    attributes?: { [key: string]: unknown };
  },
  ...args: any | undefined
) => TemplateResult;

abstract class MVPView<
  TOptionsToGet extends Record<string, unknown>,
  TOptionsToSet extends Record<string, unknown>,
  TState extends Record<string, unknown>,
  TEvents extends string = ''
> extends EventManagerMixin<Exclude<TEvents | 'render' | 'remove', ''>> {
  abstract readonly template: Template;

  static readonly templateOfRemoving = () => html``;

  protected _options: TOptionsToGet;

  protected _state: TState;

  protected readonly _theOrderOfIteratingThroughTheOptions: Extract<
    keyof TOptionsToGet,
    string
  >[];

  protected readonly _theOrderOfIteratingThroughTheState: Extract<
    keyof TState,
    string
  >[];

  constructor(
    DEFAULT_OPTIONS: TOptionsToGet,
    DEFAULT_STATE: Partial<TState>,
    options: TOptionsToSet,
    state: TState,
    {
      theOrderOfIteratingThroughTheOptions = [],
      theOrderOfIteratingThroughTheState = [],
    }: {
      theOrderOfIteratingThroughTheOptions?: Extract<
        keyof TOptionsToGet,
        string
      >[];
      theOrderOfIteratingThroughTheState?: Extract<keyof TState, string>[];
    }
  ) {
    super();

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);
    this._state = defaultsDeep({}, state, DEFAULT_STATE);

    type OptionsKey = Extract<keyof TOptionsToGet, string>;
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
    this._theOrderOfIteratingThroughTheOptions.sort(
      (a, b) =>
        this._theOrderOfIteratingThroughTheOptions.indexOf(a as OptionsKey) -
        this._theOrderOfIteratingThroughTheOptions.indexOf(b as OptionsKey)
    );
    this._theOrderOfIteratingThroughTheState.sort(
      (a, b) =>
        this._theOrderOfIteratingThroughTheState.indexOf(a as StateKey) -
        this._theOrderOfIteratingThroughTheState.indexOf(b as StateKey)
    );

    this._fixOptions()._fixState();
  }

  getOptions(): TOptionsToGet {
    const options = {} as Record<string, unknown>;

    this._theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      const [theFirstLetterOfOptionKey] = optionKey;
      const theRestLettersOfOptionKey = optionKey.slice(1);
      const getOptionMethodName = `get${
        theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
      }Option`;

      if (this[getOptionMethodName] !== undefined) {
        options[optionKey] = this[getOptionMethodName]();
      }
    });

    return options as TOptionsToGet;
  }

  setOptions(options?: TOptionsToSet) {
    const optionsToForEach = options ?? this._options;

    Object.entries(optionsToForEach)
      .sort(
        ([a], [b]) =>
          this._theOrderOfIteratingThroughTheOptions.indexOf(
            a as Extract<keyof TOptionsToGet, string>
          ) -
          this._theOrderOfIteratingThroughTheOptions.indexOf(
            b as Extract<keyof TOptionsToGet, string>
          )
      )
      .forEach(([optionKey, optionValue]) => {
        const [theFirstLetterOfOptionKey] = optionKey;
        const theRestLettersOfOptionKey = optionKey.slice(1);
        const setOptionMethodName = `set${
          theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
        }Option`;
        const valueToPass = options && optionValue;

        if (this[setOptionMethodName] !== undefined) {
          this[setOptionMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  remove() {
    this.trigger('remove');

    return this;
  }

  protected _setState(state?: Partial<TState>) {
    const keyOfStateToForEach = state ?? this._state;

    Object.entries(keyOfStateToForEach)
      .sort(
        ([a], [b]) =>
          this._theOrderOfIteratingThroughTheState.indexOf(
            a as Extract<keyof TState, string>
          ) -
          this._theOrderOfIteratingThroughTheState.indexOf(
            b as Extract<keyof TState, string>
          )
      )
      .forEach(([stateKey, stateValue]) => {
        const [theFirstLetterOfStateKey] = stateKey;
        const theRestLettersOfStateKey = stateKey.slice(1);
        const setStateMethodName = `_set${
          theFirstLetterOfStateKey.toUpperCase() + theRestLettersOfStateKey
        }State`;
        const valueToPass = state && stateValue;

        if (this[setStateMethodName] !== undefined) {
          this[setStateMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  protected _fixOptions() {
    this._theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      const [theFirstLetterOfOptionKey] = optionKey;
      const theRestLettersOfOptionKey = optionKey.slice(1);
      const fixOptionMethodName = `_fix${
        theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
      }Option`;

      if (this[fixOptionMethodName] !== undefined) {
        this[fixOptionMethodName]();
      }
    });

    return this;
  }

  protected _fixState() {
    this._theOrderOfIteratingThroughTheState.forEach((stateKey) => {
      const [theFirstLetterOfStateKey] = stateKey;
      const theRestLettersOfStateKey = stateKey.slice(1);
      const fixStateMethodName = `_fix${
        theFirstLetterOfStateKey.toUpperCase() + theRestLettersOfStateKey
      }State`;

      if (this[fixStateMethodName] !== undefined) {
        this[fixStateMethodName]();
      }
    });

    return this;
  }

  protected _render() {
    this.trigger('render');

    return this;
  }
}

const renderMVPView = <
  TArguments extends unknown[],
  TInstance extends MVPView<any, any, any>,
  TMVPViewCreator extends new (...args: TArguments) => TInstance
>(
  ViewCreator: TMVPViewCreator,
  viewParameters: TArguments,
  container: HTMLElement | DocumentFragment
) => {
  const view = new ViewCreator(...viewParameters);
  render(view.template(), container);

  const renderHandler = () => {
    render(view.template(), container);
  };

  const removeHandler = () => {
    render((ViewCreator as any).templateOfRemoving(), container);
  };

  view.on('render', renderHandler).on('remove', removeHandler);

  return view;
};

interface MVPModel<State> {
  getState(): Promise<Required<State>>;
  setState(state?: Partial<State>): Promise<this>;
  whenStateIsChanged(callback: (state: Required<State>) => void): void;
  closeConnections(): this;
}

export { MVPView, renderMVPView, MVPModel };
