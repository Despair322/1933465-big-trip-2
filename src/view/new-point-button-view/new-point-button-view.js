import { createNewPointButtonTemplate } from './new-point-button-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.#initEventListeners();
  }

  #initEventListeners() {
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
