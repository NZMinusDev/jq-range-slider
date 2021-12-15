/**
 * It's shortcut of default handleEvent in EventListenerObject
 */
// any cause of Record can have not the function fields
// eslint-disable-next-line func-style
function handleEvent<TTHis extends Record<string, any>>(
  this: TTHis,
  event: Event,
  elementName?: string
) {
  const handlerName =
    elementName === undefined
      ? `_on${event.type[0].toUpperCase()}${event.type.slice(1)}`
      : `handle${elementName[0].toUpperCase()}${elementName.slice(
          1
        )}${event.type[0].toUpperCase()}${event.type.slice(1)}`;

  if (this[handlerName]) {
    this[handlerName](event);
  }

  return this;
}

export { handleEvent as default };
