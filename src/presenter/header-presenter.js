import { render } from '../framework/render';
import { FormType, UpdateType } from '../utils/constants';
import NewPointButtonView from '../view/new-point-button-view/new-point-button-view';
import FilterPresenter from './filter-presenter';

export default class HeaderPresenter {
  #headerContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #formModel = null;

  #filterPresenter = null;
  #newPointButtonComponent = null;

  constructor({ headerContainer, pointsModel, filterModel, formModel }) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#formModel = formModel;
    this.#addObservers();
  }

  init() {
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer.querySelector('.trip-controls__filters'),
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });
    render(this.#newPointButtonComponent, this.#headerContainer);

  }

  #handleNewPointButtonClick = () => {
    this.#formModel.openForm(UpdateType.FORM, FormType.ADD);
  };

  #addObservers() {
    this.#formModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.FORM) {
      switch (this.#formModel.form) {
        case FormType.ADD:
          this.#newPointButtonComponent.element.disabled = true;
          break;
        default:
          this.#newPointButtonComponent.element.disabled = false;
          break;
      }
    }
  };
}
