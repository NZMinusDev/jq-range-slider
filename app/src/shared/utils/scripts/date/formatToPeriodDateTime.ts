import {
  MS_IN_A_SECOND,
  MS_IN_A_MINUTE,
  MS_IN_A_HOUR,
  MS_IN_A_DAY,
} from './constants';

/**
 * Converts iso date string to period datetime attribute of html <time> tag
 * @param date1 - iso date string: YYYY-MM-DDTHH:mm:ss.sssZ
 * @param date2 - iso date string: YYYY-MM-DDTHH:mm:ss.sssZ
 * @param options - which times should be included, be aware of one item is true at least
 * @param options.withDays - should include days
 * @param options.withHours - should include hours
 * @param options.withMinutes - should include minutes
 * @param options.withSeconds - should include seconds
 * @returns period string formatted for datetime of <time> html tag: PTDHMS
 * @example
 * const today = '2021-06-03T22:00:00';
 * const longAgo = '2021-07-03T20:00:30';
 *
 * console.log(formatToPeriodDateTime(longAge,today,{withDays:true,withHours:true,withMinutes:true,withSeconds:true})); // "P29DT22H0M30S"
 */
const formatToPeriodDateTime = (
  date1: string,
  date2: string,
  { isWithDays, isWithHours, isWithMinutes, isWithSeconds } = {
    isWithDays: true,
    isWithHours: false,
    isWithMinutes: false,
    isWithSeconds: false,
  }
) => {
  const theLastDate = Math.max(Date.parse(date2), Date.parse(date1));
  const theFirstDate = Math.min(Date.parse(date2), Date.parse(date1));
  const datePeriod = theLastDate - theFirstDate;

  const isWithTime = isWithHours || isWithMinutes || isWithSeconds;
  const isWithMinutesOrSeconds = isWithMinutes || isWithSeconds;

  let timeRemains = datePeriod;
  let result = 'P';

  if (isWithDays) {
    const days = isWithTime
      ? Math.floor(timeRemains / MS_IN_A_DAY)
      : Math.ceil(timeRemains / MS_IN_A_DAY);
    timeRemains -= days * MS_IN_A_DAY;
    result += `${days}D`;
  }

  if (isWithTime) {
    result += 'T';
  }

  if (isWithHours) {
    const hours = isWithMinutesOrSeconds
      ? Math.floor(timeRemains / MS_IN_A_HOUR)
      : Math.ceil(timeRemains / MS_IN_A_HOUR);
    timeRemains -= hours * MS_IN_A_HOUR;
    result += `${hours}H`;
  }

  if (isWithMinutes) {
    const minutes = isWithSeconds
      ? Math.floor(timeRemains / MS_IN_A_MINUTE)
      : Math.ceil(timeRemains / MS_IN_A_MINUTE);
    timeRemains -= minutes * MS_IN_A_MINUTE;
    result += `${minutes}M`;
  }

  if (isWithSeconds) {
    const seconds = timeRemains / MS_IN_A_SECOND;
    result += `${seconds}S`;
  }

  return result;
};

export { formatToPeriodDateTime as default };
