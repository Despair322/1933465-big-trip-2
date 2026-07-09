import EditFormView from '../view/edit-form-view/event-form-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, BLANK_POINT, BLANK_DESTINATION } from '../utils/constants.js';
import {nanoid} from 'nanoid';

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

  constructor({ addFormContainer, offersModel, destinationsModel, onDataChange, onDestroy }) {
    this.#addFormContainer = addFormContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    this.#allOffers = this.#offersModel.getOffersByType(BLANK_POINT.type);
    if (this.#addFormComponent !== null) {
      return;
    }
    this.#addFormComponent = new EditFormView(
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
    render(this.#addFormComponent, this.#addFormContainer, RenderPosition.AFTERBEGIN);
    window.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  destroy() {
    if (this.#addFormComponent === null) {
      return;
    }
    remove(this.#addFormComponent);
    this.#addFormComponent = null;
    window.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#handleDestroy();
  }

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.destroy();
    }
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...update, id: nanoid()});
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleTypeChange = (type) => this.#offersModel.getOffersByType(type);

  #handleDestinationChange = (destination) => this.#destinationsModel.getDestinationByTitle(destination);

}
