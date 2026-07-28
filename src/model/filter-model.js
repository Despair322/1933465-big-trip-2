import Observable from '../framework/observable.js';
import {FilterType} from '../utils/constants.js';

const DEFAULT_FILTER = FilterType.EVERYTHING;
export default class FilterModel extends Observable {
  #filter = DEFAULT_FILTER;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
