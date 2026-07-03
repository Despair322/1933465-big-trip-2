import { render } from './framework/render.js';
import FilterView from './view/filter-view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import { generateFilter } from './mock/filter.js';
import { generateSort } from './mock/sort.js';

const siteFiltersElement = document.querySelector('.trip-controls__filters');
const siteBoardElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.init();
const offersModel = new OffersModel();
offersModel.init();
const destinationsModel = new DestinationsModel();
destinationsModel.init();
const filters = generateFilter(pointsModel.points);
const sort = generateSort();
render(new FilterView({ filters}), siteFiltersElement);
const boardPresenter = new BoardPresenter({
  boardContainer: siteBoardElement,
  pointsModel: pointsModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel,
  sort: sort
});
boardPresenter.init();

