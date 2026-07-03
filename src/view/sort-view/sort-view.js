import { createSortTemplate } from './sort-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  #sort = null;
  #handleSortTypeChange = null;

  constructor({ sort, onSortTypeChange }) {
    super();
    this.#sort = sort;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#initEventListeners();
  }

  get template() {
    return createSortTemplate(this.#sort);
  }

  #initEventListeners() {
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
