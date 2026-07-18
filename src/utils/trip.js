import dayjs from 'dayjs';

function calculateTotalPrice(points) {
  return points.reduce((total, point) =>
    total + point.basePrice + point.offers.reduce((offerTotal, offer) => offerTotal + offer.price, 0), 0);
}

function calculateDuration(points) {
  const firstStop = points[0].dateFrom;
  const lastStop = points[points.length - 1].dateTo;
  return `${getDayOfMonth(firstStop)}${getMonth(firstStop) === getMonth(lastStop) ? '' : ` ${getMonth(firstStop)}`}&nbsp;&mdash;&nbsp;${getDayOfMonth(lastStop)} ${getMonth(lastStop)}`;
}

function getDayOfMonth(date) {
  return dayjs(date).format('D');
}

function getMonth(date) {
  return dayjs(date).format('MMM');
}

function calulatePath(points) {
  if (points.length <= 3) {
    return points.map((point) => point.destination.name).join(' \u2014 ');
  } else {
    return `${points.at(0).destination.name} &mdash; &hellip; &mdash; ${points.at(-1).destination.name}`;
  }
}

export { calculateTotalPrice, calculateDuration, calulatePath };
