import Observable from '../framework/observable.js';

export default class FormModel extends Observable {
  #form = null;

  get form() {
    return this.#form;
  }

  openForm(updateType, form) {
    this.#form = form;
    this._notify(updateType, form);
  }

  closeForm(updateType) {
    this._notify(updateType);
    this.#form = null;
  }
}
