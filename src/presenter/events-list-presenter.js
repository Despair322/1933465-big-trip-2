import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { UserAction, TimeLimit } from '../utils/constants';
import { selectViewPoints } from '../utils/selectors';
import EventPresenter from './event-presenter';
import NewPointPresenter from './new-point-presenter';

export default class EventsListPresenter {
  #eventPresenters = new Map();
  #newPointPresenter = null;
  #store = null;
  #eventsComponent = null;
  #uiBLocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #handleNewPointDestroy = null;
  #isAddFormOpen = false;

  constructor({ store, eventsComponent, onNewPointDestroy }) {
    this.#store = store;
    this.#eventsComponent = eventsComponent;
    this.#handleNewPointDestroy = onNewPointDestroy;
  }


  get isAddFormOpen() {
    return this.#isAddFormOpen;
  }

  set isAddFormOpen(value) {
    this.#isAddFormOpen = value;
  }

  init() {
    this.#render();
  }

  reset() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  updatePoint(point) {
    this.#eventPresenters.get(point.id).init({ point });
  }

  #render() {
    if (this.#isAddFormOpen) {
      if (this.#newPointPresenter === null) {
        this.#newPointPresenter = new NewPointPresenter({
          store: this.#store,
          onCloseClick: this.#handleNewPointFromClose,
          onDataChange: this.#handleViewAction
        });
      }
      this.#newPointPresenter.init({ addFormContainer: this.#eventsComponent });
    }
    const points = selectViewPoints(this.#store);
    for (let i = 0; i < points.length; i++) {
      this.#renderEvent(points[i]);
    }
  }

  #destroyNewPoint = () => {
    this.#newPointPresenter.destroy();
    this.#handleNewPointDestroy();
    this.#newPointPresenter = null;
    this.#isAddFormOpen = false;
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#eventsComponent,
      store: this.#store,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init({ point });
    this.#eventPresenters.set(point.id, eventPresenter);
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointPresenter) {
      this.#destroyNewPoint();
    }
  };

  #handleNewPointFromClose = () => {
    this.#destroyNewPoint();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBLocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#store.pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#store.pointsModel.addPoint(updateType, update);
          this.#destroyNewPoint();
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#store.pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBLocker.unblock();
  };
}
