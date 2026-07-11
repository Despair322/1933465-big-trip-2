import dayjs from 'dayjs';
import { SortType } from './constants.js';
import { getDuration } from './utils.js';

const Sorts = {
  [SortType.DAY]: (points) => points.sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom)),
  [SortType.TIME]: (points) => points.sort((a, b) => getDuration(b) - getDuration(a)),
  [SortType.PRICE]: (points) => points.sort((a, b) => b.basePrice - a.basePrice),
};

export { Sorts };
