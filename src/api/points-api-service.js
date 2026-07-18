import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

class PointAdapter {
  constructor(point) {
    this.result = point;
  }

  adaptToServer() {
    const adaptedPoint = {
      ...this.result,
      'date_to': this.result.dateTo,
      'date_from': this.result.dateFrom,
      'is_favorite': this.result.isFavorite,
      'base_price': Number(this.result.basePrice)
    };
    delete adaptedPoint.dateTo;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;
    return new PointAdapter(adaptedPoint);
  }

  adaptToAdding() {
    const adaptedPoint = { ...this.result };
    delete adaptedPoint.id;
    return new PointAdapter(adaptedPoint);
  }
}

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(new PointAdapter(point)
        .adaptToServer()
        .result),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parseResponse = await ApiService.parseResponse(response);
    return parseResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(new PointAdapter(point)
        .adaptToServer()
        .adaptToAdding()
        .result),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
    return response;
  }
}


