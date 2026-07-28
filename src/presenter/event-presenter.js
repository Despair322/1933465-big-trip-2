import EventView from '../view/event-view/event-view.js';
import EventFormView from '../view/event-form-view/event-form-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../utils/constants.js';
import { determineUpdateType, isPointNotChanged } from '../utils/utils.js';
import { selectDestinationById, selectDestinationByTitle, selectOfferByTypeAndId, selectOffersByType } from '../utils/selectors.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {

  #eventComponent = null;
  #editFormComponent = null;
  #eventContainer = null;
  #store = null;

  #point = null;
  #offers = [];
  #destination = null;
  #allOffers = [];
  #destinations = [];
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ eventContainer, store, onDataChange, onModeChange }) {
    this.#eventContainer = eventContainer;
    this.#store = store;
    this.#destinations = this.#store.destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({ point }) {
    this.#point = point;
    this.#destination = selectDestinationById(this.#store, this.#point.destination);
    this.#offers = this.#point.offers.map((offer) => selectOfferByTypeAndId(this.#store, this.#point.type, offer));
    this.#allOffers = selectOffersByType(this.#store, this.#point.type);

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
    this.#editFormComponent = new EventFormView(
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
      replace(this.#eventComponent, prevEditFormComponent);
      this.#mode = Mode.DEFAULT;

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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      window.removeEventListener('keydown', this.#escapeKeydownHandler);
      this.#editFormComponent.updateElement({
        isSaving: true,
        isDisabled: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      window.removeEventListener('keydown', this.#escapeKeydownHandler);
      this.#editFormComponent.updateElement({
        isDeleting: true,
        isDisabled: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }
    window.addEventListener('keydown', this.#escapeKeydownHandler);
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isSaving: false,
        isDisabled: false,
        isDeleting: false
      });
    };
    this.#editFormComponent.shake(resetFormState);
  }

  #render() {
    render(this.#eventComponent, this.#eventContainer);
  }

  #closeForm = () => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    this.#editFormComponent.reset({ point: this.#point, destination: this.#destination, offers: this.#offers, allOffers: this.#allOffers });
    replace(this.#eventComponent, this.#editFormComponent);
    window.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #openForm = () => {
    this.#handleModeChange();
    replace(this.#editFormComponent, this.#eventComponent);
    window.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.EDITING;
  };

  #toggleEventMode() {
    if (this.#mode === Mode.DEFAULT) {
      this.#openForm();
    } else {
      this.#closeForm();
    }
  }

  #handleRollupClick = () => {
    this.#toggleEventMode();
  };

  #handleFormSubmit = (update) => {
    if (isPointNotChanged(update, this.#point)) {
      this.#editFormComponent.shake();
      return;
    }
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      determineUpdateType(update, this.#point, this.#store.sort),
      update);
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

  #handleTypeChange = (type) => selectOffersByType(this.#store, type);

  #handleDestinationChange = (destination) => selectDestinationByTitle(this.#store, destination);

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeForm();
    }
  };
}
