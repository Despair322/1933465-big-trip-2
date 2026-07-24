import { TYPES } from '../../utils/constants.js';
import { humanizeDateAndTime } from '../../utils/utils.js';
import he from 'he';

function createOfferTemplate(offer, pointId, isChecked = false) {
  const { title, price, id } = offer;
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-${pointId}" type="checkbox" name="event-offer-${id}" ${isChecked ? 'checked' : ''} data-offer-id="${id}">
            <label class="event__offer-label" for="event-offer-${id}-${pointId}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
}

function createPhotosTemplate(photos) {
  return `<div class="event__photos-container"><div class="event__photos-tape">
  ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
  </div></div>`;
}

function createOffersTemplate(offers, allOffers, id) {
  return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                     <div class="event__available-offers">
                     ${allOffers.map((offer) => {
    const isChecked = offers.some((currentOffer) => currentOffer.id === offer.id);
    return createOfferTemplate(offer, id, isChecked);
  }).join('')}
                     </div>
                  </section>`;
}

function createPointTypeTemplate(type, id) {
  return `<div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type[0].toUpperCase() + type.slice(1)}</label>
          </div>`;
}

function createAddButtonText(isSaving, isAddForm) {
  if (isAddForm) {
    return isSaving ? 'Adding...' : 'Add';
  } else {
    return isSaving ? 'Saving...' : 'Save';
  }
}

function createResetButtonText(isDeleting, isAddForm) {
  if (isAddForm) {
    return 'Cancel';
  } else {
    return isDeleting ? 'Deleting...' : 'Delete';
  }
}

function createRollup(isAddForm) {
  return isAddForm ? '' : `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`;
}

export function createEventFormTemplate(state, destinations, isAddForm) {
  const { type, basePrice, id, dateTo, dateFrom, offers, allOffers,
    hasDescription, hasPictures, hasOffers, hasDescriptionBlock,
    isDisabled, isSaving, isDeleting } = state;
  const { name, pictures, description } = state.destination;
  const offersElement = hasOffers ? createOffersTemplate(offers, allOffers, id) : '';
  const picturesElement = hasPictures ? createPhotosTemplate(pictures) : '';
  const descriptionElement = hasDescription ? `<p class="event__destination-description"> ${he.encode(description || '')}</> ` : '';
  const pointTypesElement = TYPES.map((innerType) => createPointTypeTemplate(innerType, id)).join('');
  const destinationsElement = destinations.map((innerDestination) => `<option value = "${innerDestination.name}" ></option> `).join('');

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${pointTypesElement}
            </fieldset>
          </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${destinationsElement}
          </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeDateAndTime(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeDateAndTime(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
            &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${he.encode((basePrice || 0).toString())}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${createAddButtonText(isSaving, isAddForm)}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${createResetButtonText(isDeleting, isAddForm)}</button>
      ${createRollup(isAddForm)}
    </header >
    <section class="event__details">
      ${offersElement}
      ${hasDescriptionBlock ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${descriptionElement}
          ${picturesElement}
        </section>` : ''}
      </section >
    </form >
  </li> `;
}
