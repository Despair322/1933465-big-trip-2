import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/constants';

export default class OffersModel extends Observable {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }

  getOfferByTypeAndId(type, id) {
    return this.getOffersByType(type).find((offer) => offer.id === id);
  }

  get offers() {
    return this.#offers;
  }
}
