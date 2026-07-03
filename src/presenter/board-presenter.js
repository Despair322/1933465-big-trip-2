import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import AddFormView from '../view/add-form-view/add-form-view.js';
import { render, RenderPosition } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';
import { BLANK_DESTINATION, BLANK_POINT, TYPES, Messages, SortType } from '../utils/constants.js';
import { updateItem } from '../utils/utils.js';
import { Sorts } from '../utils/sort.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new TripEventsListView();
  #sortComponent = null;
  #noEventsComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #points = [];
  #sourcedPoints = [];
  #destinations = [];
  #sort = null;
  #currentSortType = SortType.DAY;
  #eventPresenters = new Map();

  constructor({ boardContainer, pointsModel, offersModel, destinationsModel, sort }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#sort = sort;
  }

  init() {
    this.#noEventsComponent = new NoEventsView(Messages.EVERYTHING);
    this.#points = structuredClone(this.#pointsModel.points);
    this.#sourcedPoints = structuredClone(this.#pointsModel.points);
    this.#destinations = this.#destinationsModel.destinations;
    this.#render();
  }

  #renderAddForm(container) {
    const offers = [];
    const allOffers = this.#offersModel.getOffersByType(BLANK_POINT.type);
    render(new AddFormView(
      {
        point: BLANK_POINT,
        destination: BLANK_DESTINATION,
        offers: offers,
        types: TYPES,
        allOffers: allOffers,
        destinations: this.#destinations
      }), container);
  }

  #render() {
    this.#renderSort();
    if (this.#points.length === 0) {
      this.#renderNoEvents();
      return;
    }
    this.#renderBoard();
    // this.#renderAddForm(this.#boardComponent.element);
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #sortPoints(sortType) {
    this.#points = Sorts[sortType](structuredClone(this.#sourcedPoints));
  }

  #renderSort() {
    this.#sortComponent = new SortView({ sort: this.#sort, onSortTypeChange: this.#handleSortChange });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    render(this.#noEventsComponent, this.#boardContainer);
  }

  #renderEventsList() {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderEvent(this.#points[i]);
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderEventsList();
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleEventChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#eventPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#boardComponent.element,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);
    this.#eventPresenters.set(point.id, eventPresenter);
  }
}
