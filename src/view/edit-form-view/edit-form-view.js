import { createEditFormTemplate } from './edit-form-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { deleteFlags, getDestinationFlags } from '../../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

export default class EditFormView extends AbstractStatefulView {
  #destinations = [];
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDestinationChange = null;
  #handleTypeChange = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({ point, destination, offers, allOffers, destinations, onFormSubmit, onRollupClick, onTypeChange, onDestinationChange }) {
    super();
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDestinationChange = onDestinationChange;
    this.#handleTypeChange = onTypeChange;
    this._setState(EditFormView.parseEventToState({ point, destination, offers, allOffers }));
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__section--offers')?.addEventListener('click', this.#offersChangeHandler);
    this.#setDatepickers();
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#handleDestinationChange(evt.target.value);
    if (!newDestination) {
      return;
    }
    this.updateElement({
      destination: newDestination,
      offers: [],
      ...getDestinationFlags(newDestination)
    });
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const newOffers = this.#handleTypeChange(evt.target.value);
    evt.preventDefault();
    this.updateElement({
      allOffers: newOffers,
      type: evt.target.value,
      offers: [],
      hasOffers: newOffers.length > 0
    });
  };

  #priceChangeHandler = (evt) => {
    const price = Number(evt.target.value);
    if (price && price >= 0) {
      this._setState({
        basePrice: evt.target.value,
      });
    }
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    if (this._state.offers.some((offer) => offer.id === evt.target.dataset.offerId)) {
      this._setState({
        offers: this._state.offers.filter((offer) => offer.id !== evt.target.dataset.offerId)
      });
    } else {
      this._setState({
        offers: [...this._state.offers, this._state.allOffers.find((offer) => offer.id === evt.target.dataset.offerId)]
      });
    }
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #startDateChanger = ([userDate]) => {
    this._setState({ dateFrom: userDate });

    if (dayjs(this._state.dateTo) < dayjs(userDate)) {
      this.#datepickerEnd.set('minDate', userDate);
      this.#datepickerEnd.set('defaultDate', userDate);
      this.updateElement({ dateTo: userDate });
    }
  };

  #endDateChanger = ([userDate]) => {
    this._setState({ dateTo: userDate });
  };

  reset(event) {
    this.updateElement(
      EditFormView.parseEventToState(event),
    );
  }

  removeElement() {
    super.removeElement();
    this.#datepickerStart.destroy();
    this.#datepickerStart = null;
    this.#datepickerEnd.destroy();
    this.#datepickerEnd = null;
  }

  #setDatepickers() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('[id^="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#startDateChanger,
        minDate: 'today'
      },
    );
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('[id^="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#endDateChanger
      },
    );

  }

  static parseEventToState({ point, destination, offers, allOffers }) {
    const hasOffers = offers.length > 0;
    return {
      ...point, destination, offers, allOffers, hasOffers, ...getDestinationFlags(destination)
    };
  }

  static parseStateToPoint(state) {
    const point = deleteFlags(structuredClone(state));
    point.destination = point.destination.id;
    point.offers = point.offers.map((offer) => offer.id);
    return point;
  }
}
