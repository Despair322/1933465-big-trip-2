import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }


  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parseResponse = await ApiService.parseResponse(response);
    return parseResponse;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_to': point.dateTo,
      'date_from': point.dateFrom,
      'is_favorite': point.isFavorite,
      'base_price': point.basePrice
    };
    delete adaptedPoint.dateTo;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;
    return adaptedPoint;
  }

}
