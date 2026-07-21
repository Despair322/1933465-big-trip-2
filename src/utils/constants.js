const BLANK_DESTINATION = {
  id: '',
  description: '',
  name: '',
  pictures: []
};

const BLANK_POINT = {
  id: '',
  basePrice: 0,
  dateFrom: undefined,
  dateTo: undefined,
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

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Messages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
  LOADING_ERROR: 'Failed to load latest route information',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa3';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = 'DD/MM/YY HH:mm';
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;

export { BLANK_DESTINATION, BLANK_POINT, TYPES, Messages, FilterType, SortType, UserAction, UpdateType, TimeLimit, AUTHORIZATION, END_POINT, DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT, MINUTES_IN_HOUR, HOURS_IN_DAY, MINUTES_IN_DAY };
