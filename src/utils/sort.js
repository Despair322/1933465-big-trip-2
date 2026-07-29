import dayjs from 'dayjs';
import { SortType } from './constants.js';
import { getDuration } from './utils.js';

const Sorts = {
  [SortType.DAY]: (points) => points.sort((currentPoint, nextPoint) => dayjs(currentPoint.dateFrom) - dayjs(nextPoint.dateFrom)),
  [SortType.TIME]: (points) => points.sort((currentPoint, nextPoint) => getDuration(nextPoint) - getDuration(currentPoint)),
  [SortType.PRICE]: (points) => points.sort((currentPoint, nextPoint) => nextPoint.basePrice - currentPoint.basePrice),
};

function generateSort() {
  return Object.entries(SortType).map(
    ([, value]) => ({
      type: value,
      isActive: Object.keys(Sorts).includes(value),
    })
  );
}

export { Sorts, generateSort };
