import { createSortTemplate } from './sort-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  #sort = null;
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ sort, onSortTypeChange, currentSortType }) {
    super();
    this.#sort = sort;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;
    this.#initEventListeners();
  }

  get template() {
    return createSortTemplate(this.#sort, this.#currentSortType);
  }

  #initEventListeners() {
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
