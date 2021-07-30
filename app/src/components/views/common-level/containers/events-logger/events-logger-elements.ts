type EventsLoggerElement = HTMLDivElement;

const eventsLoggerElements = document.querySelectorAll<EventsLoggerElement>('.js-events-logger');

export { eventsLoggerElements as default, EventsLoggerElement };
