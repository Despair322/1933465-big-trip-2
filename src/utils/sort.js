import { SortType } from './constants.js';
import { getDuration } from './utils.js';

const Sorts = {
  [SortType.DAY]: (points) => points,
  [SortType.TIME]: (points) => points.sort((a, b) => getDuration(a) - getDuration(b)),
  [SortType.PRICE]: (points) => points.sort((a, b) => b.basePrice - a.basePrice),
};

export { Sorts };
