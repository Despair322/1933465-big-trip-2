import { SortType } from './constants';
import { Filters } from './filter.js';
import { Sorts } from './sort.js';

function selectViewPoints(store) {
  const points = store.points;
  const filterType = store.filter;
  const sortType = store.sort;

  const filteredPoints = Filters[filterType](points);
  return Sorts[sortType](filteredPoints);
}

function selectTravelPath(store) {
  const points = store.points;
  return Sorts[SortType.DAY](points).map((point) => {
    const offers = point.offers.map((offer) => selectOfferByTypeAndId(store, point.type, offer));
    const destination = selectDestinationById(store, point.destination);
    return { ...point, offers, destination };
  });
}

function selectDestinationById(store, id) {
  return store.destinations.find((destination) => destination.id === id);
}

function selectDestinationByTitle(store, title) {
  return store.destinations.find((destination) => destination.name === title);
}

function selectOffersByType(store, type) {
  return store.offers.find((offer) => offer.type === type).offers;
}

function selectOfferByTypeAndId(store, type, id) {
  return selectOffersByType(store, type).find((offer) => offer.id === id);
}
export { selectViewPoints, selectTravelPath, selectDestinationById, selectDestinationByTitle, selectOffersByType, selectOfferByTypeAndId };
