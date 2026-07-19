import dayjs from 'dayjs';

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

  const formatNum = (value) => String(value).padStart(2, '0');

  const dStr = days ? ` ${formatNum(days)}D ` : '';
  const hStr = hours ? ` ${formatNum(hours)}H ` : '';
  const mStr = minutes ? ` ${formatNum(minutes)}M` : '';
  return dStr + hStr + mStr;
}

function getDuration({ dateFrom, dateTo }) {
  return dayjs(dateTo).diff(dayjs(dateFrom), 'm');
}

function isPointNotChanged(point, newPoint) {
  return dayjs(point.dateFrom).isSame(dayjs(newPoint.dateFrom))
    && dayjs(point.dateTo).isSame(dayjs(newPoint.dateTo))
    && point.basePrice === newPoint.basePrice
    && point.isFavorite === newPoint.isFavorite
    && point.offers.length === newPoint.offers.length
    && point.destination.id === newPoint.destination.id
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

export { humanizeDate, humanizeTime, humanizeDateAndTime, getTimeBetween, getDuration, isPointNotChanged, debounce };
