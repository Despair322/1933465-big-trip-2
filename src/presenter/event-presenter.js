import EventView from '../view/event-view/event-view.js';
import EditFormView from '../view/edit-form-view/event-form-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../utils/constants.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {

  #eventComponent = null;
  #editFormComponent = null;
  #eventContainer = null;
  #offersModel = null;
  #destinationsModel = null;

  #point = null;
  #offers = [];
  #destination = null;
  #allOffers = [];
  #destinations = [];
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ eventContainer, offersModel, destinationsModel, onDataChange, onModeChange }) {
    this.#eventContainer = eventContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#destinationsModel.getDestinationById(this.#point.destination);
    this.#offers = this.#point.offers.map((offer) => this.#offersModel.getOfferByTypeAndId(this.#point.type, offer));
    this.#allOffers = this.#offersModel.getOffersByType(this.#point.type);

    const prevEventComponent = this.#eventComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#eventComponent = new EventView(
      {
        point: this.#point,
        destination: this.#destination,
        offers: this.#offers,
        onRollupClick: this.#handleRollupClick,
        onFavoriteClick: this.#handleFavoriteClick
      }
    );
    this.#editFormComponent = new EditFormView(
      {
        point: this.#point,
        destination: this.#destination,
        offers: this.#offers,
        allOffers: this.#allOffers,
        destinations: this.#destinations,
        onFormSubmit: this.#handleFormSubmit,
        onRollupClick: this.#handleRollupClick,
        onDeleteClick: this.#handleDeleteClick,
        onTypeChange: this.#handleTypeChange,
        onDestinationChange: this.#handleDestinationChange
      });

    if (prevEventComponent === null || prevEditFormComponent === null) {
      this.#render();
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
    remove(prevEventComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeForm();
    }
  }

  #closeForm = () => {
    this.#editFormComponent.reset({ point: this.#point, destination: this.#destination, offers: this.#offers, allOffers: this.#allOffers });
    replace(this.#eventComponent, this.#editFormComponent);
    window.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #openForm() {
    this.#handleModeChange();
    replace(this.#editFormComponent, this.#eventComponent);
    window.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.EDITING;
  }

  #handleRollupClick = () => {
    this.#toggleEventMode();
  };

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeForm();
    }
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      update);
    this.#closeForm();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleTypeChange = (type) => this.#offersModel.getOffersByType(type);

  #handleDestinationChange = (destination) => this.#destinationsModel.getDestinationByTitle(destination);

  #render() {
    render(this.#eventComponent, this.#eventContainer);
  }

  #toggleEventMode() {
    if (this.#mode === Mode.DEFAULT) {
      this.#openForm();
    } else {
      this.#closeForm();
    }
  }
}
