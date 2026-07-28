export default class TravelStore {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortModel = null;

  constructor({ pointsModel, offersModel, destinationsModel, filterModel, sortModel }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
  }

  get pointsModel() {
    return this.#pointsModel;
  }

  get offersModel() {
    return this.#offersModel;
  }

  get destinationsModel() {
    return this.#destinationsModel;
  }

  get filterModel() {
    return this.#filterModel;
  }

  get sortModel() {
    return this.#sortModel;
  }

  get points() {
    return this.#pointsModel.points;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get filter() {
    return this.#filterModel.filter;
  }

  get sort() {
    return this.#sortModel.sort;
  }
}
