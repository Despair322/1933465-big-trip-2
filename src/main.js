import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import TravelStore from './store/travel-store.js';
import AppPresenter from './presenter/app-presenter.js';
import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';
import { AUTHORIZATION, END_POINT } from './utils/constants.js';

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
const sortModel = new SortModel();

const travelStore = new TravelStore({
  pointsModel: pointsModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel,
  filterModel: filterModel,
  sortModel: sortModel
});

const pointsInitialization = pointsModel.init();
const offersInitialization = offersModel.init();
const destinationsInitialization = destinationsModel.init();
const initsResult = Promise.allSettled([pointsInitialization, offersInitialization, destinationsInitialization]);

const appPresenter = new AppPresenter({
  store: travelStore,
  initsResult: initsResult
});

appPresenter.init();

