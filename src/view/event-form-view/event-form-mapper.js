import dayjs from 'dayjs';
import { deleteFlags, getFlags } from '../../utils/destination';

function parseEventToState({ point, destination, offers, allOffers }) {
  const hasOffers = allOffers.length > 0;
  const dateFrom = point.dateFrom ? dayjs(point.dateFrom).$d : undefined;
  const dateTo = point.dateTo ? dayjs(point.dateTo).$d : undefined;
  return {
    ...point, dateFrom, dateTo, destination, offers, allOffers, hasOffers, ...getFlags(destination),
  };
}

function parseStateToPoint(state) {
  const point = deleteFlags(structuredClone(state));
  point.destination = point.destination.id;
  point.offers = point.offers.map((offer) => offer.id);
  point.basePrice = Number(point.basePrice);
  return point;
}

function toggleOffers(currentOffers, allOffers, offerId) {
  if (currentOffers.some((offer) => offer.id === offerId)) {
    return currentOffers.filter((offer) => offer.id !== offerId);
  } else {
    return [...currentOffers, allOffers.find((offer) => offer.id === offerId)];
  }
}

export { parseEventToState, parseStateToPoint, toggleOffers };
