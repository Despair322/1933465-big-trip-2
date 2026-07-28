import EventFormView from '../view/event-form-view/event-form-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, BLANK_POINT, BLANK_DESTINATION } from '../utils/constants.js';
import { selectDestinationByTitle, selectOffersByType } from '../utils/selectors.js';

export default class NewPointPresenter {
  #addFormComponent = null;
  #addFormContainer = null;
  #store = null;

  #offers = [];
  #destination = null;
  #allOffers = [];
  #destinations = [];

  #handleDataChange = null;
  #handleModeChange = null;
  #handleDestroy = null;
  #handleCloseClick = null;

  constructor({ store, onDataChange, onCloseClick }) {
    this.#store = store;
    this.#destinations = this.#store.destinations;
    this.#handleDataChange = onDataChange;
    this.#handleCloseClick = onCloseClick;
  }

  init({ addFormContainer }) {
    this.#addFormContainer = addFormContainer;
    this.#allOffers = selectOffersByType(this.#store, BLANK_POINT.type);
    if (this.#addFormComponent === null) {
      this.#addFormComponent = new EventFormView(
        {
          point: BLANK_POINT,
          destination: BLANK_DESTINATION,
          offers: [],
          allOffers: this.#allOffers,
          destinations: this.#destinations,
          onFormSubmit: this.#handleFormSubmit,
          onDeleteClick: this.#handleDeleteClick,
          onTypeChange: this.#handleTypeChange,
          onDestinationChange: this.#handleDestinationChange,
          isAddForm: true
        });
    }
    this.#render();
  }

  destroy() {
    if (this.#addFormComponent === null) {
      return;
    }
    remove(this.#addFormComponent);
    this.#addFormComponent = null;
    window.removeEventListener('keydown', this.#escapeKeydownHandler);
  }

  setSaving() {
    window.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#addFormComponent.updateElement({
      isSaving: true,
      isDisabled: true
    });
  }

  setAborting() {
    window.addEventListener('keydown', this.#escapeKeydownHandler);
    const resetFormState = () => {
      this.#addFormComponent.updateElement({
        isSaving: false,
        isDisabled: false,
        isDeleting: false
      });
    };
    this.#addFormComponent.shake(resetFormState);
  }

  #render() {
    render(this.#addFormComponent, this.#addFormContainer, RenderPosition.AFTERBEGIN);
    window.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...update });
  };

  #handleDeleteClick = () => {
    this.#handleCloseClick();
    this.destroy();
  };

  #handleTypeChange = (type) => selectOffersByType(this.#store, type);

  #handleDestinationChange = (destination) => selectDestinationByTitle(this.#store, destination);

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#handleCloseClick();
      this.destroy();
    }
  };
}
