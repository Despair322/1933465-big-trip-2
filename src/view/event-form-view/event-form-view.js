import { createEventFormTemplate } from './event-form-template.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { getFlags } from '../../utils/destination.js';
import { debounce, getMaxAllowedDate, getMinAllowedDate } from '../../utils/utils.js';
import 'flatpickr/dist/flatpickr.min.css';
import { initDatePickers } from '../../utils/date-picker.js';
import { parseEventToState, parseStateToPoint, toggleOffers } from './event-form-mapper.js';
import { validateEventForm } from './event-form-validator.js';

const DEBOUNCE_TIMEOUT = 300;
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
    this._setState(parseEventToState({ point, destination, offers, allOffers }));
    this._restoreHandlers();
    this.#debounceValidateAndToggleSubmitButton = debounce(() => this.#validateAndToggleSubmitButton(), DEBOUNCE_TIMEOUT);
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

  reset(event) {
    this.updateElement(
      parseEventToState(event),
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

  #validateAndToggleSubmitButton() {
    const isValid = validateEventForm(this._state);
    this.#submitButton.disabled = !isValid;
  }

  #setDatepickers() {
    const { datepickerStart, datepickerEnd } = initDatePickers(
      this.element.querySelector('[id^="event-start-time"]'),
      this.element.querySelector('[id^="event-end-time"]'),
      this._state,
      this.#startDateChangeHandler,
      this.#endDateChangeHandler
    );
    this.#datepickerStart = datepickerStart;
    this.#datepickerEnd = datepickerEnd;
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
    this._setState({
      offers: toggleOffers(this._state.offers, this._state.allOffers, evt.target.dataset.offerId)
    });
  };

  #startDateChangeHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate });
    if (userDate) {
      const minDateTo = getMinAllowedDate(userDate);
      this.#datepickerEnd.set('minDate', minDateTo);
    } else {
      this.#datepickerEnd.set('minDate', null);
    }
    this.#validateAndToggleSubmitButton();
  };

  #endDateChangeHandler = ([userDate]) => {
    this._setState({ dateTo: userDate });
    const maxDateFrom = getMaxAllowedDate(userDate);
    this.#datepickerStart.set('maxDate', maxDateFrom);
    this.#validateAndToggleSubmitButton();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (!validateEventForm(this._state)) {
      this.shake();
      return;
    }
    this.#handleFormSubmit(parseStateToPoint(this._state));
  };
}
