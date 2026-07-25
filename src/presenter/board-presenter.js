import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { Messages, SortType, UpdateType, FilterType } from '../utils/constants.js';
import { Sorts, generateSort } from '../utils/sort.js';
import { Filters } from '../utils/filter.js';
import EventsPresenter from './events-presenter.js';
import LoadingView from '../view/loading-view/loading-veiw.js';
import ErrorView from '../view/error-view/error-view.js';


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
  #handleNewPointDestroy = null;

  #destinations = [];
  #currentSortType = SortType.DAY;
  #eventsPresenter = null;
  #sort = null;
  #readyModelsCount = 0;
  #initsResult = null;

  constructor({ boardContainer, pointsModel, offersModel, filterModel, destinationsModel, onNewPointDestroy, initsResult }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#handleNewPointDestroy = onNewPointDestroy;
    this.#initsResult = initsResult;
    this.#addObservers();
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = Filters[currentFilter](points);
    return Sorts[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#destinations = this.#destinationsModel.destinations;
    this.#eventsPresenter = new EventsPresenter({
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      eventsComponent: this.#boardComponent.element,
      onNewPointDestroy: this.#newPointDestroyHandler,
    });
    this.#initialRender();
    this.#renderLoading();
    this.#sort = generateSort();
    this.#initsResult.then((results) => {
      remove(this.#loadingComponent);
      if (results.every((result) => result.status === 'fulfilled')) {
        this.#render();
      } else {
        render(new ErrorView(Messages.LOADING_ERROR), this.#boardContainer, RenderPosition.AFTERBEGIN);
      }
    });
  }

  openAddForm() {
    this.#eventsPresenter.isAddFormOpen = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #initialRender() {
    render(this.#boardComponent, this.#boardContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #reset() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #render() {
    remove(this.#sortComponent);
    if (this.#pointsModel.points.length > 0) {
      this.#renderSort();
    }
    if (this.points.length === 0 && !this.#eventsPresenter.isAddFormOpen) {

      this.#renderNoEvents();
      return;
    }
    this.#eventsPresenter.init({ points: this.points, currentSortType: this.#currentSortType });
  }

  #renderSort() {
    this.#sortComponent = new SortView({ sort: this.#sort, onSortTypeChange: this.#handleSortChange, currentSortType: this.#currentSortType });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    this.#noEventsComponent = new ErrorView(Messages[this.#filterModel.filter]);
    render(this.#noEventsComponent, this.#boardContainer);
  }

  #resetList() {
    this.#eventsPresenter.reset();
    this.#render();
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#eventsPresenter.reset();
    remove(this.#noEventsComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsPresenter.updatePoint(data);
        break;
      case UpdateType.MINOR:
        this.#resetList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#render();
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#render();
  };

  #newPointDestroyHandler = () => {
    this.#handleNewPointDestroy();
    this.#eventsPresenter.isAddFormOpen = false;
    if (this.#pointsModel.points.length === 0) {
      this.#resetList();
    }
  };
}
