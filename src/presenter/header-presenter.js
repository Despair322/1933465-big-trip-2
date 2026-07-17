import { render } from '../framework/render';
// import { FormType, UpdateType } from '../utils/constants';
import NewPointButtonView from '../view/new-point-button-view/new-point-button-view';
import FilterPresenter from './filter-presenter';

export default class HeaderPresenter {
  #headerContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #handleNewPointButtonClick = null;

  #filterPresenter = null;
  #newPointButtonComponent = null;

  constructor({ headerContainer, pointsModel, filterModel, onClick }) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#handleNewPointButtonClick = onClick;
  }

  init() {
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer.querySelector('.trip-controls__filters'),
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler
    });
    render(this.#newPointButtonComponent, this.#headerContainer);

  }

  #newPointButtonClickHandler = () => {
    this.#handleNewPointButtonClick();
    this.#newPointButtonComponent.element.disabled = true;
  };

  unblockButton() {
    this.#newPointButtonComponent.element.disabled = false;
  }
}
