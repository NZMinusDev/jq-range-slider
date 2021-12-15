/**
 * Calculates date range
 * @param date1 - smaller date
 * @param date2 - large date
 * @returns milliseconds
 */
const getDatePeriod = (date1: Date, date2: Date) =>
  date2.getTime() - date1.getTime();

export { getDatePeriod as default };
