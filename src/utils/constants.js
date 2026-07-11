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
  [FilterType.FUTURE]: 'There are no future events now'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const FormType = {
  ADD: 'ADD',
  EDIT: 'EDIT'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
  OPEN_NEW_POINT_FORM: 'OPEN_NEW_POINT_FORM',
  CLOSE_NEW_POINT_FORM: 'CLOSE_NEW_POINT_FORM',
  OPEN_EDIT_POINT_FORM: 'OPEN_EDIT_POINT_FORM',
  CLOSE_EDIT_POINT_FORM: 'CLOSE_EDIT_POINT_FORM'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  FORM: 'FORM',
};

export { BLANK_DESTINATION, BLANK_POINT, TYPES, Messages, FilterType, SortType, FormType, UserAction, UpdateType };
