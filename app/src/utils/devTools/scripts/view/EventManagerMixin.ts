interface ListenerOfIsolatedEvent {
  (...args: unknown[]): void;
}

interface ListenerObjectOfIsolatedEvent {
  handleEvent(...args: unknown[]): void;
  [key: string]: unknown;
}

type ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent =
  | ListenerOfIsolatedEvent
  | ListenerObjectOfIsolatedEvent;

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
class EventManagerMixin<TEvents extends string> {
  protected _eventHandlers: {
    [key: string]: ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent[];
  } = {};

  // Subscribe to the event
  on(
    eventName: TEvents,
    eventHandler: ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent
  ) {
    if (this._eventHandlers[eventName] === undefined) {
      this._eventHandlers[eventName] = [];
    }

    if (!this._eventHandlers[eventName].includes(eventHandler)) {
      this._eventHandlers[eventName].push(eventHandler);
    }

    return this;
  }

  // Cancel subscribe
  off(eventName: TEvents, eventHandler: (...args: unknown[]) => void) {
    const handlers = this._eventHandlers && this._eventHandlers[eventName];

    if (handlers === undefined) {
      return this;
    }

    handlers.splice(handlers.findIndex(eventHandler), 1);

    return this;
  }

  // Generate the event with the specified name and data
  trigger(eventName: TEvents, ...args: unknown[]) {
    // no handlers
    if (
      this._eventHandlers === undefined ||
      this._eventHandlers[eventName] === undefined
    ) {
      return this;
    }

    // calling the handlers
    this._eventHandlers[eventName].forEach((eventHandler) => {
      if (typeof eventHandler === 'function') {
        eventHandler.apply(this, args);
      } else {
        eventHandler.handleEvent(...args);
      }
    });

    return this;
  }

  handleEvent(event: Event) {
    const [theFirstLetterOfEventType] = event.type;
    const theRestLettersOfEventType = event.type.slice(1);

    // mousedown -> onMousedown
    const methodName = `_on${theFirstLetterOfEventType.toUpperCase()}${theRestLettersOfEventType}`;

    if (this[methodName] !== undefined) {
      this[methodName](event);
    }

    return this;
  }
}

export {
  EventManagerMixin as default,
  ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent,
};
