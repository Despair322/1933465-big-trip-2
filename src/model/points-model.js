import Observable from '../framework/observable.js';
// import { getRandomPoints } from '../mock/points.js';
import { UpdateType } from '../utils/constants.js';
// const POINTS_COUNT = 1;

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;


  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      await this.#pointsApiService.updatePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updateType, update) {
    this.#points = [...this.#points, update];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite,
    };
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    return adaptedPoint;
  }
}
