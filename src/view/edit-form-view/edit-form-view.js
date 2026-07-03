import { createEditFormTemplate } from './edit-form-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EditFormView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #types = [];
  #allOffers = [];
  #destinations = [];
  #handleFormSubmit = null;
  #handleRollupClick = null;

  constructor({ point, destination, offers, types, allOffers, destinations, onFormSubmit, onRollupClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#types = types;
    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#initEventListeners();
  }

  #initEventListeners() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createEditFormTemplate(
      {
        point: this.#point,
        destination: this.#destination,
        offers: this.#offers,
        types: this.#types,
        allOffers: this.#allOffers,
        destinations: this.#destinations
      });
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };
}
