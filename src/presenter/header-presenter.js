import { render, RenderPosition, replace } from '../framework/render';
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
    this.#tripInfoComponent = new TripInfoView({
      title: calulatePath(this.#points),
      dates: calculateDuration(this.#points),
      cost: calculateTotalPrice(this.#points)
    });
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer.querySelector('.trip-controls__filters'),
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler
    });
    this.#render();
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #render() {
    render(this.#newPointButtonComponent, this.#headerContainer);
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.#preparePoints();
    const newTripInfoComponent = new TripInfoView({
      title: calulatePath(this.#points),
      dates: calculateDuration(this.#points),
      cost: calculateTotalPrice(this.#points)
    });
    replace(newTripInfoComponent, this.#tripInfoComponent);
    this.#tripInfoComponent = newTripInfoComponent;
  };

  #newPointButtonClickHandler = () => {
    this.#handleNewPointButtonClick();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #preparePoints() {
    this.#points = this.#pointsModel.points.map((point) => {
      const offers = point.offers.map((offer) =>
        this.#offersModel.getOfferByTypeAndId(point.type, offer));
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      return { ...point, offers, destination };
    });
  }

  unblockButton() {
    this.#newPointButtonComponent.element.disabled = false;
  }
}
