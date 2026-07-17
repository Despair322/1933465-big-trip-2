import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import NoEventsView from '../view/no-events-view/no-events-view.js';
import { Messages, SortType, UpdateType, FilterType, FormType } from '../utils/constants.js';
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
  #eventsPresenter = null;
  #sort = null;
  #readyModelsCount = 0;
  #isLoading = true;

  constructor({ boardContainer, pointsModel, offersModel, filterModel, destinationsModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#handleNewPointDestroy = onNewPointDestroy;
    this.#addObservers();
  }

  #addObservers() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#destinations = this.#destinationsModel.destinations;
    this.#eventsPresenter = new EventsPresenter({
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onNewPointDestroy: this.#handleNewPointDestroy,
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

  #newPointDestroyHandler(){
    this.#handleNewPointDestroy();
  }

  openAddForm(){
    this.#eventsPresenter.init({ isAddFormOpen: true });
  }
}
