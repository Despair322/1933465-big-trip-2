import dayjs from 'dayjs';
import { DATE_FORMAT, DATETIME_FORMAT, HOURS_IN_DAY, MINUTES_IN_DAY, MINUTES_IN_HOUR, TIME_FORMAT } from './constants';

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
  const days = Math.floor(duration / MINUTES_IN_DAY);
  const hours = Math.floor((duration / MINUTES_IN_HOUR) % HOURS_IN_DAY);
  const minutes = (duration % MINUTES_IN_HOUR);

  const formatNum = (value) => String(value).padStart(2, '0');

  const dStr = days ? ` ${formatNum(days)}D ` : '';
  const hStr = hours ? ` ${formatNum(hours)}H ` : '';
  const mStr = minutes ? ` ${formatNum(minutes)}M` : '';
  return dStr + hStr + mStr;
}

function getMaxAllowedDate(date) {
  return date ? dayjs(date).subtract(1, 'minute').$d : null;
}

function getMinAllowedDate(date) {
  return date ? dayjs(date).add(1, 'minute').$d : null;
}

function getDuration({ dateFrom, dateTo }) {
  return dayjs(dateTo).diff(dayjs(dateFrom), 'm');
}

function isPointNotChanged(point, newPoint) {
  const isOffersEqual = point.offers.length === newPoint.offers.length && point.offers.every((offer) => newPoint.offers.some((newOffer) => newOffer === offer));
  return dayjs(point.dateFrom).isSame(dayjs(newPoint.dateFrom))
    && dayjs(point.dateTo).isSame(dayjs(newPoint.dateTo))
    && point.basePrice === newPoint.basePrice
    && point.isFavorite === newPoint.isFavorite
    && isOffersEqual
    && point.destination === newPoint.destination
    && point.type === newPoint.type;
}

function debounce(func, delay = 500) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export { humanizeDate, humanizeTime, humanizeDateAndTime, getTimeBetween, getDuration, isPointNotChanged, debounce, getMinAllowedDate, getMaxAllowedDate };
