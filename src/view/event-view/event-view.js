import { createEventTemplate } from './event-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class EventView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({ point, destination, offers, onRollupClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#initEventListeners();
  }

  get template() {
    return createEventTemplate(this.#point, this.#destination, this.#offers);
  }

  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
