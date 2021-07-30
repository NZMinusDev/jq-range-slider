import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import eventsLoggers from '../events-logger';

type EventsLoggerFireflyElement = HTMLDivElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type EventsLoggerFireflyCustomEvents = {};

class EventsLoggerFirefly extends BEMComponent<
  EventsLoggerFireflyElement,
  EventsLoggerFireflyCustomEvents
> {
  static blinkAnimationDuration = 250;

  // eslint-disable-next-line no-useless-constructor
  constructor(eventsLoggerFireflyElement: EventsLoggerFireflyElement) {
    super(eventsLoggerFireflyElement);
  }

  turnOn() {
    this.element.classList.add('events-logger__firefly_active');

    return this;
  }
  turnOff() {
    this.element.classList.remove('events-logger__firefly_active');

    return this;
  }
  blink() {
    this.turnOn();

    setTimeout(() => {
      this.turnOff();
    }, EventsLoggerFirefly.blinkAnimationDuration);

    return this;
  }
}

type EventsLoggerFireflyElementWithComponent = HTMLElementWithComponent<
  EventsLoggerFireflyElement,
  EventsLoggerFireflyCustomEvents,
  EventsLoggerFirefly
>;

const eventsLoggerFireflies = eventsLoggers
  .map((eventsLogger) =>
    Array.from(
      eventsLogger.element.querySelectorAll<EventsLoggerFireflyElement>(
        '.js-events-logger__firefly'
      ),
      (eventsLoggerFireflyElement) => new EventsLoggerFirefly(eventsLoggerFireflyElement)
    )
  )
  .flat();

export type {
  EventsLoggerFireflyCustomEvents,
  EventsLoggerFirefly,
  EventsLoggerFireflyElementWithComponent,
};

export { eventsLoggerFireflies as default };
