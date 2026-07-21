import { createTripInfoTemplate } from './trip-info-template.js';
import AbstractView from '../../framework/view/abstract-view.js';

export default class TripInfoView extends AbstractView {
  #title = null;
  #dates = null;
  #cost = null;

  constructor({ title, dates, cost }) {
    super();
    this.#title = title;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate({
      title: this.#title,
      dates: this.#dates,
      cost: this.#cost,
    });
  }
}
