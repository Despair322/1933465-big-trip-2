import { remove, render, RenderPosition, replace } from '../framework/render';
import { FilterType, UpdateType } from '../utils/constants';
import { selectTravelPath } from '../utils/selectors';
import { calculateDuration, calculateTotalPrice, calulatePath } from '../utils/trip';
import NewPointButtonView from '../view/new-point-button-view/new-point-button-view';
import TripInfoView from '../view/trip-info-view/trip-info-view';
import FilterPresenter from './filter-presenter';

export default class HeaderPresenter {
  #headerContainer = null;
  #store = null;
  #handleNewPointButtonClick = null;

  #filterPresenter = null;
  #newPointButtonComponent = null;
  #tripInfoComponent = null;
  #points = null;

  constructor({ headerContainer, store, onClick }) {
    this.#store = store;
    this.#headerContainer = headerContainer;
    this.#handleNewPointButtonClick = onClick;

    this.#addObservers();
  }

  init() {
    this.#points = selectTravelPath(this.#store);
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler
    });
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer.querySelector('.trip-controls__filters'),
      store: this.#store,
      onFilterTypeChange: this.#handleFilterTypeChange
    });
    this.#filterPresenter.init();
    this.#render();
  }

  unblockButton() {
    this.#newPointButtonComponent.element.disabled = false;
  }

  #handleFilterTypeChange = (updateType, filterType) => {
    this.#store.sortModel.reset();
    this.#store.filterModel.setFilter(updateType, filterType);
  };

  #addObservers() {
    this.#store.pointsModel.addObserver(this.#handleModelEvent);
  }

  #render() {
    render(this.#newPointButtonComponent, this.#headerContainer);
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    if (this.#points.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }
    const newTripInfoComponent = new TripInfoView({
      title: calulatePath(this.#points),
      dates: calculateDuration(this.#points),
      cost: calculateTotalPrice(this.#points)
    });
    if (this.#tripInfoComponent) {
      replace(newTripInfoComponent, this.#tripInfoComponent);
    } else {
      render(newTripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
    this.#tripInfoComponent = newTripInfoComponent;
  }

  #handleModelEvent = () => {
    this.#points = selectTravelPath(this.#store);
    this.#renderTripInfo();
    this.#filterPresenter.init();
  };

  #newPointButtonClickHandler = () => {
    this.#handleNewPointButtonClick();
    this.#newPointButtonComponent.element.disabled = true;
    this.#handleFilterTypeChange(UpdateType.MAJOR, FilterType.EVERYTHING);
  };
}
