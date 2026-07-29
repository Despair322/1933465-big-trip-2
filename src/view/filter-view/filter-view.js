import { createFilterTemplate } from './filter-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.#initEventListeners();
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #initEventListeners() {
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };
}
