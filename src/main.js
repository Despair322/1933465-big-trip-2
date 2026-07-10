import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { generateSort } from './mock/sort.js';
import NewPointButtonView from './view/new-point-button-view/new-point-button-view.js';
import { render } from './framework/render.js';

const siteFiltersElement = document.querySelector('.trip-controls__filters');
const siteBoardElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
pointsModel.init();
offersModel.init();
destinationsModel.init();
const sort = generateSort();
const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersElement,
  filterModel: filterModel,
  pointsModel: pointsModel,
});
const boardPresenter = new BoardPresenter({
  boardContainer: siteBoardElement,
  pointsModel: pointsModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel,
  filterModel: filterModel,
  sort: sort,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick(){
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteHeaderElement);
filterPresenter.init();
boardPresenter.init();

