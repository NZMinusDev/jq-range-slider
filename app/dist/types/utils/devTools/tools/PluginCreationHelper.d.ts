import { TemplateResult } from "lit-html";
import { ClassInfo } from "lit-html/directives/class-map";
import { StyleInfo } from "lit-html/directives/style-map";
export interface Plugin {
    readonly dom: {
        self: HTMLElement | null;
    };
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
export declare class EventManagerMixin<TEvents extends string> {
    protected _eventHandlers: {
        [key: string]: handler[];
    };
    on(eventName: TEvents, handler: handler): this;
    off(eventName: TEvents, handler: (...args: any) => void): this;
    trigger(eventName: TEvents, ...args: any): this;
    handleEvent(event: Event): this;
}
export interface CustomEventListener {
    (...args: any): void;
}
export interface CustomEventListenerObject {
    handleEvent(...args: any): void;
    [key: string]: any;
}
export declare type handler = CustomEventListener | CustomEventListenerObject;
export declare abstract class MVPView<TOptionsToGet extends object, TOptionsToSet extends object, TState extends object, TEvents extends string = ""> extends EventManagerMixin<Exclude<TEvents | "render" | "remove", "">> {
    readonly template: template;
    static readonly templateOfRemoving: () => TemplateResult;
    protected _options: TOptionsToGet;
    protected _state: TState;
    protected readonly _theOrderOfIteratingThroughTheOptions: Extract<keyof TOptionsToGet, string>[];
    protected readonly _theOrderOfIteratingThroughTheState: Extract<keyof TState, string>[];
    constructor(DEFAULT_OPTIONS: TOptionsToGet, DEFAULT_STATE: Partial<TState>, options: TOptionsToSet, state: TState, { theOrderOfIteratingThroughTheOptions, theOrderOfIteratingThroughTheState, }: {
        theOrderOfIteratingThroughTheOptions?: Extract<keyof TOptionsToGet, string>[];
        theOrderOfIteratingThroughTheState?: Extract<keyof TState, string>[];
    });
    getOptions(): TOptionsToGet;
    setOptions(options?: TOptionsToSet): this;
    remove(): this;
    protected _setState(state?: Partial<TState>): this;
    protected _fixOptions(): this;
    protected _fixState(): this;
    protected _render(): this;
}
export declare type template = (attributes?: {
    classInfo?: ClassInfo;
    styleInfo?: StyleInfo;
    attributes?: {
        [key: string]: unknown;
    };
}, ...args: any | undefined) => TemplateResult;
export declare function renderMVPView<TMVPViewCreator extends new (...args: TArguments) => TInstance, TArguments extends unknown[], TInstance extends MVPView<any, any, any>>(ViewCreator: TMVPViewCreator, viewParameters: TArguments, container: HTMLElement | DocumentFragment): TInstance;
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
export declare abstract class PluginDecorator {
    protected plugin: Plugin;
    protected listeners: ListenersByPlugin[];
    constructor(plugin: Plugin, listeners: ListenersByPlugin[], modifierName: string);
    protected assign(): void;
    protected cancel(): void;
}
/**
 *
 * @param event - event of handler
 * @param parent - HTMLElement with handlers
 * @param descendantSelector - necessary descendant
 * @returns result of checking
 */
export declare function checkDelegatingEvents(event: Event, parent: HTMLElement, descendantSelector: string): boolean;
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
export declare function applyMixins<TDerivedConstructor extends new (...args: unknown[]) => unknown, TMixinConstructors extends new (...args: unknown[]) => unknown>(derivedConstructor: TDerivedConstructor, mixinConstructors: TMixinConstructors[]): void;