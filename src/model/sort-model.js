import Observable from '../framework/observable.js';
import { SortType } from '../utils/constants.js';

const DEFAULT_SORT = SortType.DAY;
export default class SortModel extends Observable {
  #sort = DEFAULT_SORT;

  get sort() {
    return this.#sort;
  }

  setSort(updateType, sort) {
    this.#sort = sort;
    this._notify(updateType, sort);
  }

  reset() {
    this.#sort = DEFAULT_SORT;
  }
}
