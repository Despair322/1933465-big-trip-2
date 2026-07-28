import { createNewPointButtonTemplate } from './new-point-button-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.#initEventListeners();
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #initEventListeners() {
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
