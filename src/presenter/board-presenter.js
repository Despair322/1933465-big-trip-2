import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';
import { Messages, SortType, UpdateType, UserAction, FilterType, FormType } from '../utils/constants.js';
import { Sorts } from '../utils/sort.js';
import { Filters } from '../utils/filter.js';
import EventsPresenter from './events-presenter.js';
import { generateSort } from '../utils/utils.js';
import LoadingView from '../view/loading-view/loading-veiw.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noEventsComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #formModel = null;
  #handleNewPointDestroy = null;

  #destinations = [];
  #currentSortType = SortType.DAY;
  #newPointPresenter = null;
  #eventsPresenter = null;
  #sort = null;
  #readyModelsCount = 0;
  #isLoading = true;

  constructor({ boardContainer, pointsModel, offersModel, filterModel, destinationsModel, formModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#formModel = formModel;
    this.#handleNewPointDestroy = onNewPointDestroy;
    this.#addObservers();
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#formModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#destinations = this.#destinationsModel.destinations;
    this.#eventsPresenter = new EventsPresenter({
      pointsModel: this.#pointsModel,
      formModel: this.#formModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction
    });
    this.#sort = generateSort();
    this.#render();
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = Filters[currentFilter](points);
    return Sorts[this.#currentSortType](filteredPoints);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#formModel.closeForm(UpdateType.FORM);
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.CLOSE_NEW_POINT_FORM:
      case UserAction.CLOSE_EDIT_POINT_FORM:
        this.#formModel.closeForm(UpdateType.FORM);
        break;
      case UserAction.OPEN_EDIT_POINT_FORM:
        this.#formModel.openForm(UpdateType.FORM, FormType.EDIT);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsPresenter.events.get(data.id).init({ point: data });
        break;
      case UpdateType.MINOR:
        this.#resetList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#render();
        break;
      case UpdateType.FORM:
        if (data === FormType.ADD) {
          this.#reset();
          break;
        }
        if (this.#pointsModel.points.length === 0) {
          this.#resetList();
        }
        break;
      case UpdateType.INIT:
        this.#readyModelsCount++;
        if (this.#readyModelsCount === 3) {
          remove(this.#loadingComponent);
          this.#isLoading = false;
          this.#render();
        }
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#render();
  };

  #reset() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #render() {
    render(this.#boardComponent, this.#boardContainer);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort({ currentSortType: this.#currentSortType });

    this.#renderList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({ sort: this.#sort, onSortTypeChange: this.#handleSortChange, currentSortType: this.#currentSortType });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    this.#noEventsComponent = new NoEventsView(Messages[this.#filterModel.filter]);
    remove(this.#loadingComponent);
    render(this.#noEventsComponent, this.#boardContainer);
  }

  #renderList() {
    if (this.points.length === 0 && this.#formModel.form !== FormType.ADD) {
      this.#renderNoEvents();
      return;
    }
    this.#eventsPresenter.init({ eventsComponent: this.#boardComponent.element, points: this.points, currentSortType: this.#currentSortType });
  }

  #resetList() {
    this.#eventsPresenter.reset();
    this.#renderList();
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#eventsPresenter.reset();
    remove(this.#boardComponent);
    remove(this.#sortComponent);
    remove(this.#noEventsComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
