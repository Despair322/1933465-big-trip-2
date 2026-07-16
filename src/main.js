import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import AppPresenter from './presenter/app-presenter.js';
import FormModel from './model/form-model.js';
import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa3j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pointsModel = new PointsModel(
  { pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION) }
);
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const formModel = new FormModel();
const pointsInitialization = pointsModel.init();
const offersInitialization = offersModel.init();
const destinationsInitialization = destinationsModel.init();
const allInits = Promise.all([pointsInitialization, offersInitialization, destinationsInitialization]);

const appPresenter = new AppPresenter({
  pointsModel: pointsModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel,
  filterModel: filterModel,
  formModel: formModel,
  allInits: allInits
});

appPresenter.init();

