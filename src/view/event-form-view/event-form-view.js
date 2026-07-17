import { createEventFormTemplate } from './event-form-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { deleteFlags, getFlags } from '../../utils/destination.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

export default class EventFormView extends AbstractStatefulView {
  #destinations = [];
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;
  #handleDestinationChange = null;
  #handleTypeChange = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #isAddForm = false;
  #submitButton = null;
  #initialState = null;
  constructor({ point, destination, offers, allOffers, destinations, onFormSubmit, onRollupClick, onDeleteClick, onTypeChange, onDestinationChange, isAddForm = false }) {
    super();
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleDestinationChange = onDestinationChange;
    this.#handleTypeChange = onTypeChange;
    this.#isAddForm = isAddForm;
    this._setState(EventFormView.parseEventToState({ point, destination, offers, allOffers }));
    this.#initialState = structuredClone(this._state);
    this._restoreHandlers();
    this.#submitButton = this.element.querySelector('.event__save-btn');
    if (this.#isAddForm) {
      this.#submitButton.disabled = true;
    }
  }

  get template() {
    return createEventFormTemplate(this._state, this.#destinations, this.#isAddForm);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__section--offers')?.addEventListener('click', this.#offersChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDatepickers();
  }

  #validateForm() {
    if (!this._state.destination.id) {
      this.#submitButton.disabled = true;
      return;
    }
    if (!this._state?.dateFrom?.getTime() || !this._state?.dateTo?.getTime()) {
      this.#submitButton.disabled = true;
      return;
    }
    if(this._state?.dateFrom?.getTime() >= this._state?.dateTo?.getTime()){
      this.#submitButton.disabled = true;
      return;
    }
    if (!this._state.basePrice.toString().trim()) {
      this.#submitButton.disabled = true;
      return;
    }
    this.#submitButton.disabled = false;
  }

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

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#handleDestinationChange(evt.target.value);
    if (!newDestination) {
      this.#submitButton.disabled = true;
      return;
    }
    this.updateElement({
      destination: newDestination,
      offers: [],
      ...getFlags(newDestination),
    });
  };

  #priceChangeHandler = (evt) => {
    if (!evt.target.value.trim() || evt.target.value < 0 || isNaN(evt.target.value)) {
      this.#submitButton.disabled = true;
      return;
    }
    this._setState({
      basePrice: Number(evt.target.value),
    });
    this.#validateForm();
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

  #startDateChanger = ([userDate]) => {
    this._setState({ dateFrom: userDate });
    this.#datepickerEnd.set('minDate', userDate);
    this.#validateForm();
  };

  #endDateChanger = ([userDate]) => {
    this._setState({ dateTo: userDate });
    this.#datepickerStart.set('maxDate', userDate);
    this.#validateForm();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventFormView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this.#submitButton.disabled) {
      return;
    }
    this.#handleFormSubmit(EventFormView.parseStateToPoint(this._state));
  };

  reset(event) {
    this.updateElement(
      EventFormView.parseEventToState(event),
    );
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  #setDatepickers() {
    const commonOptions = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      locale: { firstDayOfWeek: 1 },
    };
    this.#datepickerStart = flatpickr(
      this.element.querySelector('[id^="event-start-time"]'),
      {
        ...commonOptions,
        defaultDate: this._state.dateFrom,
        onClose: this.#startDateChanger,
        minDate: 'today',
        maxDate: this._state.dateTo
      },
    );
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('[id^="event-end-time"]'),
      {
        ...commonOptions,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom || 'today',
        onClose: this.#endDateChanger
      },
    );

  }

  updateElement(update) {
    super.updateElement(update);
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.#validateForm();
  }

  static parseEventToState({ point, destination, offers, allOffers }) {
    const hasOffers = offers.length > 0;
    const dateFrom = point.dateFrom ? dayjs(point.dateFrom).$d : undefined;
    const dateTo = point.dateTo ? dayjs(point.dateTo).$d : undefined;
    return {
      ...point, dateFrom, dateTo, destination, offers, allOffers, hasOffers, ...getFlags(destination),
    };
  }

  static parseStateToPoint(state) {
    const point = deleteFlags(structuredClone(state));
    point.destination = point.destination.id;
    point.offers = point.offers.map((offer) => offer.id);
    return point;
  }
}
