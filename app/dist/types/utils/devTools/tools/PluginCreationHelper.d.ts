import { TemplateResult } from 'lit-html';
import { ClassInfo } from 'lit-html/directives/class-map';
import { StyleInfo } from 'lit-html/directives/style-map';
/**
 * It's shortcut of default handleEvent in EventListenerObject
 */
declare function handleEvent(event: Event, elementName?: string): any;
interface CustomEventListener {
    (...args: any): void;
}
interface CustomEventListenerObject {
    handleEvent(...args: any): void;
    [key: string]: any;
}
declare type handler = CustomEventListener | CustomEventListenerObject;
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
declare class EventManagerMixin<TEvents extends string> {
    protected _eventHandlers: {
        [key: string]: handler[];
    };
    on(eventName: TEvents, eventHandler: handler): this;
    off(eventName: TEvents, eventHandler: (...args: any) => void): this;
    trigger(eventName: TEvents, ...args: any): this;
    handleEvent(event: Event): this;
}
declare type template = (attributes?: {
    classInfo?: ClassInfo;
    styleInfo?: StyleInfo;
    attributes?: {
        [key: string]: unknown;
    };
}, ...args: any | undefined) => TemplateResult;
declare abstract class MVPView<TOptionsToGet extends Record<string, unknown>, TOptionsToSet extends Record<string, unknown>, TState extends Record<string, unknown>, TEvents extends string = ''> extends EventManagerMixin<Exclude<TEvents | 'render' | 'remove', ''>> {
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
declare const renderMVPView: <TArguments extends unknown[], TInstance extends MVPView<any, any, any, "">, TMVPViewCreator extends new (...args: TArguments) => TInstance>(ViewCreator: TMVPViewCreator, viewParameters: TArguments, container: HTMLElement | DocumentFragment) => TInstance;
interface MVPModel<State> {
    getState(): Promise<Required<State>>;
    setState(state?: Partial<State>): Promise<this>;
    whenStateIsChanged(callback: (state: Required<State>) => void): void;
}
export { handleEvent, CustomEventListener, CustomEventListenerObject, handler, EventManagerMixin, template, MVPView, renderMVPView, MVPModel, };
