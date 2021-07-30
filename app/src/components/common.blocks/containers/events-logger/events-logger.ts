import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import {
  EventsLoggerFireflyCustomEvents,
  EventsLoggerFireflyElementWithComponent,
} from './__firefly/events-logger__firefly';

type EventsLoggerElement = HTMLDivElement;

type EventsLoggerDOM = {
  fireflies: EventsLoggerFireflyElementWithComponent[];
};

type EventsLoggerCustomEvents = EventsLoggerFireflyCustomEvents;

class EventsLogger extends BEMComponent<EventsLoggerElement, EventsLoggerCustomEvents> {
  protected readonly _DOM: Readonly<EventsLoggerDOM>;

  constructor(eventsLoggerElement: EventsLoggerElement) {
    super(eventsLoggerElement);

    this._DOM = this._initDOM();
  }

  blinkFirefly(index: number) {
    this._DOM.fireflies[index].component.blink();
  }

  protected _initDOM() {
    const fireflies = [
      ...this.element.querySelectorAll('.js-events-logger__firefly'),
    ] as EventsLoggerDOM['fireflies'];

    return { fireflies };
  }
}

type EventsLoggerElementWithComponent = HTMLElementWithComponent<
  EventsLoggerElement,
  EventsLoggerCustomEvents,
  EventsLogger
>;

const eventsLoggers = Array.from(
  document.querySelectorAll<EventsLoggerElement>('.js-events-logger'),
  (eventsLoggerElement) => new EventsLogger(eventsLoggerElement)
);

export type { EventsLoggerCustomEvents, EventsLogger, EventsLoggerElementWithComponent };

export { eventsLoggers as default };
