import { createErrorTemplate } from './error-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class ErrorView extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createErrorTemplate(this.#message);
  }
}
