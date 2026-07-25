import { remove, render, RenderPosition, replace } from '../framework/render';
import { SortType } from '../utils/constants';
import { Sorts } from '../utils/sort';
import { calculateDuration, calculateTotalPrice, calulatePath } from '../utils/trip';
import NewPointButtonView from '../view/new-point-button-view/new-point-button-view';
import TripInfoView from '../view/trip-info-view/trip-info-view';
import FilterPresenter from './filter-presenter';

export default class HeaderPresenter {
  #headerContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleNewPointButtonClick = null;

  #filterPresenter = null;
  #newPointButtonComponent = null;
  #tripInfoComponent = null;
  #points = null;

  constructor({ headerContainer, pointsModel, offersModel, destinationsModel, filterModel, onClick }) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleNewPointButtonClick = onClick;

    this.#addObservers();
  }

  init() {
    this.#preparePoints();
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler
    });
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer.querySelector('.trip-controls__filters'),
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
    this.#render();
  }

  unblockButton() {
    this.#newPointButtonComponent.element.disabled = false;
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
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

  #preparePoints() {
    const points = this.#pointsModel.points;
    this.#points = Sorts[SortType.DAY](points).map((point) => {
      const offers = point.offers.map((offer) =>
        this.#offersModel.getOfferByTypeAndId(point.type, offer));
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      return { ...point, offers, destination };
    });
  }

  #handleModelEvent = () => {
    this.#preparePoints();
    this.#renderTripInfo();
    this.#filterPresenter.init();
  };

  #newPointButtonClickHandler = () => {
    this.#handleNewPointButtonClick();
    this.#newPointButtonComponent.element.disabled = true;
  };
}
