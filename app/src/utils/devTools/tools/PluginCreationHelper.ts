import { defaultsDeep } from "lodash-es";

export interface Plugin {
  readonly dom: { self: HTMLElement };
}

/**
 * Add events processing inside class without inheritances
 * @example
 * class Menu { // create class with using methods of mixin
 *   choose(value) { this.trigger("select", value); }
 * }
 * applyMixins(Menu, EventManagerMixin);// add mixin
 *
 * interface Menu extends Menu, EventManagerMixin {}
 *
 * let menu = new Menu();
 *
 * menu.on("select", value => alert(`The selected value: ${value}`));
 * menu.choose("123"); // 123
 */
export class EventManagerMixin {
  #eventHandlers;

  // Subscribe to the event
  on(eventName: string, handler: (...args: unknown[]) => void) {
    if (!this.#eventHandlers) this.#eventHandlers = {};
    if (!this.#eventHandlers[eventName]) {
      this.#eventHandlers[eventName] = [];
    }
    this.#eventHandlers[eventName].push(handler);
  }
  // Cancel subscribe
  off(eventName: string, handler: (...args: unknown[]) => void) {
    let handlers = this.#eventHandlers && this.#eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  }
  // Generate the event with the specified name and data
  trigger(eventName: string, ...args: unknown[]) {
    if (!this.#eventHandlers || !this.#eventHandlers[eventName]) {
      return; // no handlers
    }
    // calling the handlers
    this.#eventHandlers[eventName].forEach((handler) => handler.apply(this, args));
  }
}

export abstract class MVPView<OptionsToGet extends object, OptionsToSet extends object>
  extends EventManagerMixin
  implements Plugin {
  readonly dom: { self: HTMLElement };

  protected _options: OptionsToGet;

  constructor(
    container: HTMLElement,
    DEFAULT_OPTIONS: OptionsToGet,
    options: OptionsToSet,
    protected theOrderOfIteratingThroughTheOptions: Extract<keyof OptionsToGet, string>[]
  ) {
    super();

    this.dom = { self: container };

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);

    this._fixOptions();
  }

  getOptions(): OptionsToGet {
    const options: any = {};
    let getOptionMethodName;
    this.theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      getOptionMethodName = `get${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
      if (this[getOptionMethodName]) options[optionKey] = this[getOptionMethodName]();
    });

    return options as OptionsToGet;
  }

  setOptions(options?: OptionsToSet) {
    const optionsToForEach = options === undefined ? this._options : options;

    let setOptionMethodName;
    let valueToPass;
    Object.entries(optionsToForEach)
      .sort(
        ([a], [b]) =>
          this.theOrderOfIteratingThroughTheOptions.indexOf(
            a as Extract<keyof OptionsToGet, string>
          ) -
          this.theOrderOfIteratingThroughTheOptions.indexOf(
            b as Extract<keyof OptionsToGet, string>
          )
      )
      .forEach(([optionKey, optionValue]) => {
        setOptionMethodName = `set${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
        valueToPass = options === undefined ? undefined : optionValue;

        if (this[setOptionMethodName]) {
          this[setOptionMethodName](valueToPass);
        }
      });

    return this;
  }

  remove() {
    this.dom.self.remove();

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

  protected _render() {
    let renderOptionMethodName;
    this.theOrderOfIteratingThroughTheOptions.forEach((option) => {
      renderOptionMethodName = `_render${option[0].toUpperCase() + option.slice(1)}Option`;
      if (this[renderOptionMethodName]) this[renderOptionMethodName]();
    });

    return this;
  }
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

    if (this.plugin.dom.self[modifierName]) {
      this.plugin.dom.self[modifierName].cancel();
    }

    this.plugin.dom.self[modifierName] = this;
    this.plugin.dom.self[modifierName].assign();
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
 * Make child's handlers inside one class
 * @example
 * class Menu {
 *   handleEvent(event) {
 *     // mousedown -> onMousedown
 *     let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
 *     this[method](event);
 *   }
 *
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
export abstract class EventHandler {
  protected handleEvent(event: Event) {
    // mousedown -> onMousedown
    let method = "on" + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
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
