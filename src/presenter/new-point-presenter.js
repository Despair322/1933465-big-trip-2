import EventFormView from '../view/event-form-view/event-form-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, BLANK_POINT, BLANK_DESTINATION } from '../utils/constants.js';

export default class NewPointPresenter {

  #addFormComponent = null;
  #addFormContainer = null;
  #offersModel = null;
  #destinationsModel = null;

  #offers = [];
  #destination = null;
  #allOffers = [];
  #destinations = [];

  #handleDataChange = null;
  #handleModeChange = null;
  #handleDestroy = null;
  #handleCloseClick = null;

  constructor({ offersModel, destinationsModel, onDataChange, onCloseClick }) {
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;
    this.#handleDataChange = onDataChange;
    this.#handleCloseClick = onCloseClick;
  }

  init({ addFormContainer }) {
    this.#addFormContainer = addFormContainer;
    this.#allOffers = this.#offersModel.getOffersByType(BLANK_POINT.type);
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
    this.#handleDataChange(UserAction.CLOSE_NEW_POINT_FORM, UpdateType.FORM);
  }

  #render() {
    render(this.#addFormComponent, this.#addFormContainer, RenderPosition.AFTERBEGIN);
    window.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.destroy();
    }
  };

  #handleFormSubmit = async (update) => {
    try {
      await this.#handleDataChange(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        { ...update });
      this.destroy();
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(
      UserAction.CLOSE_NEW_POINT_FORM,
      UpdateType.FORM
    );
    this.destroy();
  };

  #handleTypeChange = (type) => this.#offersModel.getOffersByType(type);

  #handleDestinationChange = (destination) => this.#destinationsModel.getDestinationByTitle(destination);

  setSaving() {
    this.#addFormComponent.updateElement({
      isSaving: true,
      isDisabled: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#addFormComponent.updateElement({
        isSaving: false,
        isDisabled: false,
        isDeleting: false
      });
    };
    this.#addFormComponent.shake(resetFormState);
  }
}
