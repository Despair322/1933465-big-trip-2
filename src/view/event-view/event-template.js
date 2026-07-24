import { humanizeDate, humanizeTime, getTimeBetween } from '../../utils/utils.js';
import he from 'he';

function createOfferTemplate(offer) {
  const { title, price } = offer;
  return `<li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>`;
}

export function createEventTemplate(point, destination, offers) {
  const { type, basePrice, isFavorite, dateFrom, dateTo } = point;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const offersElement = offers.length ? `<ul class="event__selected-offers">${offers.map(createOfferTemplate).join('')}</ul>` : '';
  return `<li class="trip-events__item">
          <div class="event">
            <time class="event__date" datetime="2019-03-18">${humanizeDate(dateFrom)}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${dateFrom}">${humanizeTime(dateFrom)}</time>
                &mdash;
                <time class="event__end-time" datetime="${dateTo}">${humanizeTime(dateTo)}</time>
              </p>
              <p class="event__duration">${getTimeBetween(dateFrom, dateTo)}</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${he.encode((basePrice || 0).toString())}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            ${offersElement}
            <button class="event__favorite-btn ${favoriteClass}" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>
        </li>`;
}
