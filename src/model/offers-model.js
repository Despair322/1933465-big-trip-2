import Observable from '../framework/observable.js';

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
      throw new Error('Can\'t load offers');
    }
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
