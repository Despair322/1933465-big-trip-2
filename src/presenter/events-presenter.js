import { FormType } from '../utils/constants';
import EventPresenter from './event-presenter';
import NewPointPresenter from './new-point-presenter';

export default class EventsPresenter {
  #eventPresenters = new Map();
  #newPointPresenter = null;
  #formModel = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleViewAction = null;
  #eventsComponent = null;
  #points = null;
  #currentSortType = null;

  constructor({ pointsModel, formModel, offersModel, destinationsModel, onDataChange }) {
    this.#formModel = formModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#handleViewAction = onDataChange;
  }

  init({ eventsComponent, points, currentSortType }) {
    this.#eventsComponent = eventsComponent;
    this.#points = points;
    this.#currentSortType = currentSortType;
    this.#render();
  }

  reset() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  get events() {
    return this.#eventPresenters;
  }

  #render() {
    if (this.#formModel.form === FormType.ADD) {
      if (this.#newPointPresenter === null) {
        this.#newPointPresenter = new NewPointPresenter({
          offersModel: this.#offersModel,
          destinationsModel: this.#destinationsModel,
          onDataChange: this.#handleViewAction
        });
      }
      this.#newPointPresenter.init({ addFormContainer: this.#eventsComponent });
    }
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderEvent(this.#points[i]);
    }

  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
  };

  #handleNewPointFromClose = () => {
    this.#newPointPresenter.destroy();
    this.#newPointPresenter = null;
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#eventsComponent,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init({ point, currentSortType: this.#currentSortType });
    this.#eventPresenters.set(point.id, eventPresenter);
  }
}
