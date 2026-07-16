// import { getDestinations } from '../mock/destinations';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/constants.js';
export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getDestinationByTitle(title) {
    return this.destinations.find((destination) => destination.name === title);
  }
}
