export default class OffersModel {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
      throw new Error('Can\'t load offers');
    }
  }
}
