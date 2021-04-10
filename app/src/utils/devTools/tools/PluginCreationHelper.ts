import { html, render, TemplateResult } from "lit-html";
import { ClassInfo } from "lit-html/directives/class-map";
import { StyleInfo } from "lit-html/directives/style-map";
import { defaultsDeep } from "lodash-es";

export interface Plugin {
  readonly dom: { self: HTMLElement | null };
}

/**
 * Add events processing inside class without inheritances and make child's handlers inside one class
 * @example
 * // example 1
 * class Menu {
 *   choose(value) { this.trigger("select", value); }
 * }
 * applyMixins(Menu, EventManagerMixin);// add mixin (or use "extends" if you can)
 *
 * interface Menu extends Menu, EventManagerMixin {}
 *
 * let menu = new Menu();
 *
 * menu.on("select", value => alert(`The selected value: ${value}`));
 * menu.choose("123"); // 123
 *
 * // example 2
 * class Menu {
 *   onMousedown(event) {
 *     event.currentTarget.innerHTML = "The mouse button is pressed";
 *   }
 *
 *   onMouseup(event) {
 *     event.currentTarget.innerHTML += "...and unpressed.";
 *   }
 * }
 *
 * let menu = new Menu();
 * btn.addEventListener('mousedown', menu);
 * btn.addEventListener('mouseup', menu);
 */
export class EventManagerMixin<TEvents extends string> {
  protected eventHandlers: {
    [key: string]: handler[];
  } = {};

  // Subscribe to the event
  on(eventName: TEvents, handler: handler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    if (!this.eventHandlers[eventName].includes(handler)) {
      this.eventHandlers[eventName].push(handler);
    }

    return this;
  }
  // Cancel subscribe
  off(eventName: TEvents, handler: (...args: any) => void) {
    let handlers = this.eventHandlers && this.eventHandlers[eventName];
    if (!handlers) return this;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }

    return this;
  }
  // Generate the event with the specified name and data
  trigger(eventName: TEvents, ...args: any) {
    if (!this.eventHandlers || !this.eventHandlers[eventName]) {
      return this; // no handlers
    }
    // calling the handlers
    this.eventHandlers[eventName].forEach((handler) => {
      if (typeof handler === "function") {
        handler.apply(this, args);
      } else {
        handler.handleEvent(...args);
      }
    });

    return this;
  }

  handleEvent(event: Event) {
    // mousedown -> onMousedown
    let method = "_on" + event.type[0].toUpperCase() + event.type.slice(1);
    if (this[method]) this[method](event);

    return this;
  }
}
export interface CustomEventListener {
  (...args: any): void;
}
export interface CustomEventListenerObject {
  handleEvent(...args: any): void;
  [key: string]: any;
}
export type handler = CustomEventListener | CustomEventListenerObject;

export abstract class MVPView<
  TOptionsToGet extends object,
  TOptionsToSet extends object,
  TState extends object,
  TEvents extends string = ""
> extends EventManagerMixin<Exclude<TEvents | "render" | "remove", "">> {
  readonly template: template = ({ classInfo, styleInfo, attributes } = {}, ...args) => html``;
  static readonly templateOfRemoving = () => html``;

  protected _options: TOptionsToGet;
  protected _state: TState;

  protected readonly theOrderOfIteratingThroughTheOptions: Extract<keyof TOptionsToGet, string>[];
  protected readonly theOrderOfIteratingThroughTheState: Extract<keyof TState, string>[];

  constructor(
    DEFAULT_OPTIONS: TOptionsToGet,
    DEFAULT_STATE: Partial<TState>,
    options: TOptionsToSet,
    state: TState,
    {
      theOrderOfIteratingThroughTheOptions = [],
      theOrderOfIteratingThroughTheState = [],
    }: {
      theOrderOfIteratingThroughTheOptions?: Extract<keyof TOptionsToGet, string>[];
      theOrderOfIteratingThroughTheState?: Extract<keyof TState, string>[];
    }
  ) {
    super();

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);
    this._state = defaultsDeep({}, state, DEFAULT_STATE);

    type OptionsKey = Extract<keyof TOptionsToGet, string>;
    type StateKey = Extract<keyof TState, string>;
    this.theOrderOfIteratingThroughTheOptions = Array.from(
      new Set(
        ([] as OptionsKey[]).concat(
          Object.keys(this._options) as OptionsKey[],
          theOrderOfIteratingThroughTheOptions
        )
      )
    );
    this.theOrderOfIteratingThroughTheState = Array.from(
      new Set(
        ([] as StateKey[]).concat(
          Object.keys(this._state) as StateKey[],
          theOrderOfIteratingThroughTheState
        )
      )
    );
    this.theOrderOfIteratingThroughTheOptions.sort(
      (a, b) =>
        this.theOrderOfIteratingThroughTheOptions.indexOf(a as OptionsKey) -
        this.theOrderOfIteratingThroughTheOptions.indexOf(b as OptionsKey)
    );
    this.theOrderOfIteratingThroughTheState.sort(
      (a, b) =>
        this.theOrderOfIteratingThroughTheState.indexOf(a as StateKey) -
        this.theOrderOfIteratingThroughTheState.indexOf(b as StateKey)
    );

    this._fixOptions()._fixState();
  }

  getOptions(): TOptionsToGet {
    const options: any = {};

    let getOptionMethodName;
    this.theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      getOptionMethodName = `get${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
      if (this[getOptionMethodName]) options[optionKey] = this[getOptionMethodName]();
    });

    return options as TOptionsToGet;
  }
  setOptions(options?: TOptionsToSet) {
    const optionsToForEach = options === undefined ? this._options : options;

    let setOptionMethodName;
    let valueToPass;
    Object.entries(optionsToForEach)
      .sort(
        ([a], [b]) =>
          this.theOrderOfIteratingThroughTheOptions.indexOf(
            a as Extract<keyof TOptionsToGet, string>
          ) -
          this.theOrderOfIteratingThroughTheOptions.indexOf(
            b as Extract<keyof TOptionsToGet, string>
          )
      )
      .forEach(([optionKey, optionValue]) => {
        setOptionMethodName = `set${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
        valueToPass = options === undefined ? undefined : optionValue;

        if (this[setOptionMethodName]) {
          this[setOptionMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  remove() {
    this.trigger("remove");

    return this;
  }

  protected _setState(state?: Partial<TState>) {
    const keyOfStateToForEach = state === undefined ? this._state : state;

    let setStateMethodName;
    let valueToPass;
    Object.entries(keyOfStateToForEach)
      .sort(
        ([a], [b]) =>
          this.theOrderOfIteratingThroughTheState.indexOf(a as Extract<keyof TState, string>) -
          this.theOrderOfIteratingThroughTheState.indexOf(b as Extract<keyof TState, string>)
      )
      .forEach(([stateKey, stateValue]) => {
        setStateMethodName = `set${stateKey[0].toUpperCase() + stateKey.slice(1)}State`;
        valueToPass = state === undefined ? undefined : stateValue;

        if (this[setStateMethodName]) {
          this[setStateMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  protected _fixOptions() {
    let fixOptionMethodName;
    this.theOrderOfIteratingThroughTheOptions.forEach((option) => {
      fixOptionMethodName = `_fix${option[0].toUpperCase() + option.slice(1)}Option`;
      if (this[fixOptionMethodName]) this[fixOptionMethodName]();
    });

    return this;
  }
  protected _fixState() {
    let fixStateMethodName;
    this.theOrderOfIteratingThroughTheState.forEach((state) => {
      fixStateMethodName = `_fix${state[0].toUpperCase() + state.slice(1)}State`;
      if (this[fixStateMethodName]) this[fixStateMethodName]();
    });

    return this;
  }

  protected _render() {
    this.trigger("render");

    return this;
  }
}
export type template = (
  attributes?: {
    classInfo?: ClassInfo;
    styleInfo?: StyleInfo;
    attributes?: { [key: string]: unknown };
  },
  ...args: any | undefined
) => TemplateResult;

export function renderMVPView<
  TMVPViewCreator extends new (...args: TArguments) => TInstance,
  TArguments extends unknown[],
  TInstance extends MVPView<any, any, any>
>(
  ViewCreator: TMVPViewCreator,
  viewParameters: TArguments,
  container: HTMLElement | DocumentFragment
) {
  const view = new ViewCreator(...viewParameters);
  render(view.template({}), container);

  view
    .on("render", () => {
      render(view.template({}), container);
    })
    .on("remove", () => {
      render((ViewCreator as any).templateOfRemoving(), container);
    });

  return view;
}

export interface MVPModel<State> {
  getState(): Promise<Required<State>>;
  setState(state?: Partial<State>): Promise<this>;
  whenStateIsChanged(callback: (state: Required<State>) => void): void;
}

export interface ListenersByPlugin {
  currentTarget: HTMLElement | HTMLElement[];
  eventType: keyof HTMLElementEventMap;
  listener(this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]): unknown;
  options?: boolean | AddEventListenerOptions;
}
export abstract class PluginDecorator {
  protected plugin: Plugin;
  protected listeners: ListenersByPlugin[];

  constructor(plugin: Plugin, listeners: ListenersByPlugin[], modifierName: string) {
    this.plugin = plugin;
    this.listeners = listeners;

    if (this.plugin.dom.self !== null) {
      if (this.plugin.dom.self[modifierName]) {
        this.plugin.dom.self[modifierName].cancel();
      }

      this.plugin.dom.self[modifierName] = this;
      this.plugin.dom.self[modifierName].assign();
    }
  }

  protected assign(): void {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        if (Array.isArray(listener.currentTarget)) {
          listener.currentTarget.forEach((element) => {
            element.addEventListener(listener.eventType, listener.listener, listener.options);
          });
        } else {
          listener.currentTarget.addEventListener(
            listener.eventType,
            listener.listener,
            listener.options
          );
        }
      });
    }
  }
  protected cancel(): void {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
        if (Array.isArray(listener.currentTarget)) {
          listener.currentTarget.forEach((element) => {
            element.removeEventListener(listener.eventType, listener.listener, listener.options);
          });
        } else {
          listener.currentTarget.removeEventListener(
            listener.eventType,
            listener.listener,
            listener.options
          );
        }
      });
    }
  }
}

/**
 *
 * @param event - event of handler
 * @param parent - HTMLElement with handlers
 * @param descendantSelector - necessary descendant
 * @returns result of checking
 */
export function checkDelegatingEvents(
  event: Event,
  parent: HTMLElement,
  descendantSelector: string
) {
  let descendant = (event.target as HTMLElement).closest(descendantSelector);

  if (!descendant && !parent.contains(descendant)) return false;

  return true;
}

/**
 * Apply mixins to derivedConstructor.
 * @param derivedConstructor - class/constructor to derived
 * @param mixinConstructors - classes/constructors adding functionality to derivedConstructor
 * @example
 * // Each mixin is a traditional ES class
 * class Jumpable {
 *  jump() {}
 * }
 *
 * class Duckable {
 *   duck() {}
 * }
 *
 * // Including the base
 * class Sprite {
 *   x = 0;
 *   y = 0;
 * }
 *
 * // Then you create an interface which merges
 * // the expected mixins with the same name as your base
 * interface Sprite extends Jumpable, Duckable {}
 * // Apply the mixins into the base class via the JS at runtime
 * applyMixins(Sprite, [Jumpable, Duckable]);
 *
 * let player = new Sprite();
 * player.jump();
 * console.log(player.x, player.y);
 */
export function applyMixins<
  TDerivedConstructor extends new (...args: unknown[]) => unknown,
  TMixinConstructors extends new (...args: unknown[]) => unknown
>(derivedConstructor: TDerivedConstructor, mixinConstructors: TMixinConstructors[]) {
  mixinConstructors.forEach((baseConstructor) => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedConstructor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseConstructor.prototype, name) || Object.create(null)
      );
    });
  });
}
