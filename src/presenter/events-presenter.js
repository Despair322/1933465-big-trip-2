import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { UserAction } from '../utils/constants';
// import { pointNotChanged } from '../utils/utils';
import EventPresenter from './event-presenter';
import NewPointPresenter from './new-point-presenter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class EventsPresenter {
  #eventPresenters = new Map();
  #newPointPresenter = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #eventsComponent = null;
  #points = null;
  #currentSortType = null;
  #uiBLocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #handleNewPointDestroy = null;
  #isAddFormOpen = false;

  constructor({ pointsModel, offersModel, destinationsModel, onNewPointDestroy }) {
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#handleNewPointDestroy = onNewPointDestroy;
  }

  init({ eventsComponent, points, currentSortType, isAddFormOpen }) {
    this.#eventsComponent = eventsComponent || this.#eventsComponent;
    this.#points = points || this.#points;
    this.#currentSortType = currentSortType || this.#currentSortType;
    if (isAddFormOpen) {
      this.#isAddFormOpen = isAddFormOpen;
      this.#eventPresenters.forEach((presenter) => presenter.resetView());
      if (this.#isAddFormOpen) {
        if (this.#newPointPresenter === null) {
          this.#newPointPresenter = new NewPointPresenter({
            offersModel: this.#offersModel,
            destinationsModel: this.#destinationsModel,
            onCloseClick: this.#handleNewPointFromClose,
            onDataChange: this.#handleViewAction
          });
        }
        this.#newPointPresenter.init({ addFormContainer: this.#eventsComponent });
      }
      return;
    }
    this.#render();
  }

  reset() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
      this.#newPointPresenter = null;
    }
  }

  #render() {
    if (this.#isAddFormOpen) {
      if (this.#newPointPresenter === null) {
        this.#newPointPresenter = new NewPointPresenter({
          offersModel: this.#offersModel,
          destinationsModel: this.#destinationsModel,
          onCloseClick: this.#handleNewPointFromClose,
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
      this.#destroyNewPoint();
      this.#handleNewPointDestroy();
    }
  };

  #handleNewPointFromClose = () => {
    this.#handleNewPointDestroy();
    this.#destroyNewPoint();
  };

  #destroyNewPoint = () => {
    this.#newPointPresenter.destroy();
    this.#handleNewPointDestroy();
    this.#newPointPresenter = null;
    this.#isAddFormOpen = false;
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBLocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        // console.log
        // if(pointNotChanged(update, this.#eventPresenters.get(update.id).point)) {
        //   this.#eventPresenters.get(update.id).setAborting();
        //   break;
        // }
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {

          await this.#pointsModel.addPoint(updateType, update);
          this.#destroyNewPoint();
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBLocker.unblock();
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

  updatePoint(point) {
    this.#eventPresenters.get(point.id).init({ point });
  }
}
