import { remove, render, replace } from '../framework/render.js';
import { Filters } from '../utils/filter.js';
import { UpdateType } from '../utils/constants.js';
import FilterView from '../view/filter-view/filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #store = null;
  #onFilterTypeChange = null;

  #filterComponent = null;

  constructor({ filterContainer, store, onFilterTypeChange }) {
    this.#filterContainer = filterContainer;
    this.#onFilterTypeChange = onFilterTypeChange;
    this.#store = store;
    this.#addObservers();
  }

  get filters() {
    const points = this.#store.points;
    return Object.entries(Filters).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        count: filterPoints(points).length,
      }),
    );
  }

  init() {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#store.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #addObservers() {
    this.#store.filterModel.addObserver(this.#handleModelEvent);
    this.#store.pointsModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#store.filter === filterType) {
      return;
    }
    this.#onFilterTypeChange(UpdateType.MAJOR, filterType);
  };
}
