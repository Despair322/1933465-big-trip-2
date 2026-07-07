import dayjs from 'dayjs';

const BLANK_DESTINATION = {
  id: '',
  description: '',
  name: '',
  pictures: []
};

const BLANK_POINT = {
  id: '',
  basePrice: '',
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const Messages = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export { BLANK_DESTINATION, BLANK_POINT, TYPES, Messages, FilterType, SortType };
