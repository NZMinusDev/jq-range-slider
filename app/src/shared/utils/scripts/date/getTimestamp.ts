/**
 * Converts datestring to milliseconds
 * @param datestring - iso date string: YYYY-MM-DDTHH:mm:ss.sssZ
 * @returns milliseconds
 */
const getTimestamp = (datestring: string) => new Date(datestring).getTime();

export { getTimestamp as default };
