import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import AddFormView from '../view/add-form-view/add-form-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';
import { BLANK_DESTINATION, BLANK_POINT, TYPES, Messages, SortType, UpdateType, UserAction } from '../utils/constants.js';
import { Sorts } from '../utils/sort.js';
import { Filters } from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new TripEventsListView();
  #sortComponent = null;
  #noEventsComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #destinations = [];
  #sort = null;
  #currentSortType = SortType.DAY;
  #eventPresenters = new Map();

  constructor({ boardContainer, pointsModel, offersModel, filterModel, destinationsModel, sort }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#sort = sort;

    this.#addObservers();
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#destinations = this.#destinationsModel.destinations;
    this.#render();
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = Filters[filterType](points);

    if (this.#currentSortType === SortType.DAY) {
      return filteredPoints;
    }
    return Sorts[this.#currentSortType](structuredClone(filteredPoints));
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#render();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#render();
        break;
    }
  };

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
    if (this.points.length === 0) {
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
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({ sort: this.#sort, onSortTypeChange: this.#handleSortChange, currentSortType: this.#currentSortType });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    this.#noEventsComponent = new NoEventsView(Messages[this.#filterModel.filter]);
    render(this.#noEventsComponent, this.#boardContainer);
  }

  #renderBoard() {
    this.#renderSort({ currentSortType: this.#currentSortType });
    render(this.#boardComponent, this.#boardContainer);
    this.#renderEventsList();
  }

  #renderEventsList() {
    for (let i = 0; i < this.points.length; i++) {
      this.#renderEvent(this.points[i]);
    }
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#clearEventsList();
    remove(this.#boardComponent);
    remove(this.#sortComponent);
    remove(this.#noEventsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#boardComponent.element,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);
    this.#eventPresenters.set(point.id, eventPresenter);
  }
}
