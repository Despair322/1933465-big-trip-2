import TripEventsListView from '../view/trip-events-list-view/trip-events-list-view.js';
import SortView from '../view/sort-view/sort-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { Messages, UpdateType } from '../utils/constants.js';
import { generateSort } from '../utils/sort.js';

import EventsListPresenter from './events-list-presenter.js';
import LoadingView from '../view/loading-view/loading-veiw.js';
import ErrorView from '../view/error-view/error-view.js';
import { selectViewPoints } from '../utils/selectors.js';


export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noEventsComponent = null;
  #store = null;
  #handleNewPointDestroy = null;

  #destinations = [];
  #eventsListPresenter = null;
  #sort = null;
  #initsResult = null;

  constructor({ boardContainer, store, onNewPointDestroy, initsResult }) {
    this.#boardContainer = boardContainer;
    this.#store = store;
    this.#handleNewPointDestroy = onNewPointDestroy;
    this.#initsResult = initsResult;
    this.#addObservers();
  }

  get points() {
    return selectViewPoints(this.#store);
  }

  init() {
    this.#destinations = this.#store.destinations;
    this.#eventsListPresenter = new EventsListPresenter({
      store: this.#store,
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
    this.#eventsListPresenter.isAddFormOpen = true;
  }

  #addObservers() {
    this.#store.pointsModel.addObserver(this.#handleModelEvent);
    this.#store.filterModel.addObserver(this.#handleModelEvent);
    this.#store.sortModel.addObserver(this.#handleModelEvent);
  }

  #initialRender() {
    render(this.#boardComponent, this.#boardContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #render() {
    remove(this.#sortComponent);
    if (this.#store.points.length > 0) {
      this.#renderSort();
    }
    if (this.points.length === 0 && !this.#eventsListPresenter.isAddFormOpen) {

      this.#renderNoEvents();
      return;
    }
    this.#eventsListPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortView({ sort: this.#sort, onSortTypeChange: this.#handleSortChange, currentSortType: this.#store.sort });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    this.#noEventsComponent = new ErrorView(Messages[this.#store.filter]);
    render(this.#noEventsComponent, this.#boardContainer);
  }

  #resetList() {
    this.#eventsListPresenter.reset();
    this.#render();
  }

  #clearBoard() {
    this.#eventsListPresenter.reset();
    remove(this.#noEventsComponent);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsListPresenter.updatePoint(data);
        break;
      case UpdateType.MINOR:
        this.#resetList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#render();
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#store.sort === sortType) {
      return;
    }
    this.#store.sortModel.setSort(UpdateType.MAJOR, sortType);
  };

  #newPointDestroyHandler = () => {
    this.#handleNewPointDestroy();
    this.#eventsListPresenter.isAddFormOpen = false;
    if (this.#store.points.length === 0) {
      this.#resetList();
    }
  };
}
