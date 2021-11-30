import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/components/BEM/BEMComponent';

import eventsLoggerElements from '../events-logger-elements';

type EventsLoggerFireflyElement = HTMLDivElement;

type EventsLoggerFireflyCustomEvents = {};

class EventsLoggerFirefly extends BEMComponent<
  EventsLoggerFireflyElement,
  EventsLoggerFireflyCustomEvents
> {
  static blinkAnimationDuration = 250;

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

const eventsLoggerFireflies = Array.from(
  eventsLoggerElements,
  (eventsLoggerElement) =>
    Array.from(
      eventsLoggerElement.querySelectorAll<EventsLoggerFireflyElement>(
        '.js-events-logger__firefly'
      ),
      (eventsLoggerFireflyElement) =>
        new EventsLoggerFirefly(eventsLoggerFireflyElement)
    )
).flat();

export type {
  EventsLoggerFireflyCustomEvents,
  EventsLoggerFirefly,
  EventsLoggerFireflyElementWithComponent,
};

export { eventsLoggerFireflies as default };
