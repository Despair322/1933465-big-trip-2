import dayjs from 'dayjs';
import { Sorts } from './sort';
import { SortType } from './constants';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = 'DD/MM/YY HH:mm';

function humanizeDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizeTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function humanizeDateAndTime(date) {
  return date ? dayjs(date).format(DATETIME_FORMAT) : '';
}

function getTimeBetween(dateFrom, dateTo) {
  const duration = getDuration({ dateFrom, dateTo });
  const days = Math.floor(duration / 1440);
  const hours = Math.floor((duration / 60) % 24);
  const minutes = (duration % 60);
  const dStr = days ? ` ${days.toString().padStart(2, '0')}D ` : '';
  const hStr = hours ? ` ${hours.toString().padStart(2, '0')}H ` : '';
  const mStr = minutes ? ` ${minutes.toString().padStart(2, '0')}M` : '';
  return dStr + hStr + mStr;
}

function getDuration({ dateFrom, dateTo }) {
  return dayjs(dateTo).diff(dayjs(dateFrom), 'm');
}

function generateSort() {
  return Object.entries(SortType).map(
    ([, value]) => ({
      type: value,
      isActive: Object.keys(Sorts).includes(value),
    })
  );
}

export { humanizeDate, humanizeTime, humanizeDateAndTime, getTimeBetween, getDuration, generateSort };
