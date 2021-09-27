interface CustomEventListener<TEventDetail extends Record<string, unknown>> {
  (event: CustomEvent<TEventDetail>): void;
}

interface CustomEventListenerObject<
  TEventDetail extends Record<string, unknown>
> {
  handleEvent(event: CustomEvent<TEventDetail>): void;
  [key: string]: unknown;
}

type CustomEventListenerOrCustomEventListenerObject<
  TEventDetail extends Record<string, unknown>
> = CustomEventListener<TEventDetail> | CustomEventListenerObject<TEventDetail>;

type HTMLElementWithComponent<
  THTMLElement extends HTMLElement,
  TCustomEvents extends Record<string, Record<string, unknown>>,
  TBEMComponent extends BEMComponent<THTMLElement, TCustomEvents>
> = THTMLElement & { component: TBEMComponent };

/**
 * Common BEM block / element class
 * Tip: It has side effect - assigns 'component' prop to element
 */
abstract class BEMComponent<
  THTMLElement extends HTMLElement,
  TCustomEvents extends Record<string, Record<string, unknown>>
> {
  readonly element: HTMLElementWithComponent<THTMLElement, TCustomEvents, this>;

  constructor(element: THTMLElement) {
    this.element = element as HTMLElementWithComponent<
      THTMLElement,
      TCustomEvents,
      this
    >;
    this.element.component = this;
  }

  addCustomEventListener<TCustomEventType extends keyof TCustomEvents>(
    type: TCustomEventType,
    listener: CustomEventListenerOrCustomEventListenerObject<
      TCustomEvents[TCustomEventType]
    >,
    options?: boolean | AddEventListenerOptions
  ) {
    this.element.addEventListener(
      type as string,
      listener as EventListenerOrEventListenerObject,
      options
    );
  }
}

export { BEMComponent as default, HTMLElementWithComponent };
