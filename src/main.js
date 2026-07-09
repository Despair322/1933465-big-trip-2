import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { generateSort } from './mock/sort.js';

const siteFiltersElement = document.querySelector('.trip-controls__filters');
const siteBoardElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.init();
const offersModel = new OffersModel();
offersModel.init();
const destinationsModel = new DestinationsModel();
destinationsModel.init();
const filterModel = new FilterModel();
const sort = generateSort();
const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersElement,
  filterModel: filterModel,
  pointsModel: pointsModel,
});
filterPresenter.init();
const boardPresenter = new BoardPresenter({
  boardContainer: siteBoardElement,
  pointsModel: pointsModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel,
  filterModel: filterModel,
  sort: sort
});
boardPresenter.init();

