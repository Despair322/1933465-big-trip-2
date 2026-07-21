import { createEventFormTemplate } from './event-form-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { deleteFlags, getFlags } from '../../utils/destination.js';
import { debounce, getMaxAllowedDate, getMinAllowedDate } from '../../utils/utils.js';
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
  #debounceValidateAndToggleSubmitButton = null;

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
    this._restoreHandlers();
    this.#debounceValidateAndToggleSubmitButton = debounce(() => this.#validateAndToggleSubmitButton(), 350);
  }

  get template() {
    return createEventFormTemplate(this._state, this.#destinations, this.#isAddForm);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__section--offers')?.addEventListener('click', this.#offersChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDatepickers();
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.#validateAndToggleSubmitButton();
  }

  #validateAndToggleSubmitButton() {
    const isValid = this.#validateForm();
    this.#submitButton.disabled = !isValid;
  }

  #validateForm() {
    if (!this._state.destination.id) {
      return false;
    }
    if (!this._state?.dateFrom?.getTime() || !this._state?.dateTo?.getTime()) {
      return false;
    }
    if (dayjs(this._state.dateFrom).isAfter(this._state.dateTo) || dayjs(this._state.dateTo).isSame(this._state.dateFrom)) {
      return false;
    }
    if (!this._state.basePrice.toString().trim() || this._state.basePrice <= 0 || isNaN(this._state.basePrice)) {
      return false;
    }
    return true;
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
    const newDestination = this.#handleDestinationChange(evt.target.value) || { id: '', name: evt.target.value, pictures: [], description: '' };
    this.updateElement({
      destination: newDestination,
      offers: [],
      ...getFlags(newDestination),
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value,
    });
    this.#debounceValidateAndToggleSubmitButton();
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

  #startDateChangeHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate });
    if (userDate) {
      const minDateTo = getMaxAllowedDate(userDate);
      this.#datepickerEnd.set('minDate', minDateTo);
    } else {
      this.#datepickerEnd.set('minDate', null);
    }
    this.#debounceValidateAndToggleSubmitButton();
  };

  #endDateChangeHandler = ([userDate]) => {
    this._setState({ dateTo: userDate });
    const maxDateFrom = getMinAllowedDate(userDate);
    this.#datepickerStart.set('maxDate', maxDateFrom);
    this.#debounceValidateAndToggleSubmitButton();
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
    if (!this.#validateForm()) {
      this.shake();
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
        onClose: this.#startDateChangeHandler,
        maxDate: getMinAllowedDate(this._state.dateTo)
      },
    );
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('[id^="event-end-time"]'),
      {
        ...commonOptions,
        defaultDate: this._state.dateTo,
        minDate: getMaxAllowedDate(this._state.dateFrom),
        onClose: this.#endDateChangeHandler
      },
    );
  }

  static parseEventToState({ point, destination, offers, allOffers }) {
    const hasOffers = allOffers.length > 0;
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
    point.basePrice = Number(point.basePrice);
    return point;
  }
}
