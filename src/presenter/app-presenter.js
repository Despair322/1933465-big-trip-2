import BoardPresenter from './board-presenter';
import HeaderPresenter from './header-presenter';

export default class AppPresenter {
  #headerPresenter = null;
  #boardPresenter = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #boardContainer = null;
  #headerContainer = null;

  #allInits = null;

  constructor({ pointsModel, offersModel, destinationsModel, filterModel, allInits }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#allInits = allInits;
    this.#findContainers();
  }

  #findContainers() {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerContainer = document.querySelector('.trip-main');
  }

  #newPointButtonClickHandler = () => {
    this.#boardPresenter.openAddForm();
  };

  #newPointFormCloseHandler = () => {
    this.#headerPresenter.unblockButton();
  };

  init() {
    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#boardContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel,
      allInits: this.#allInits,
      onNewPointDestroy: this.#newPointFormCloseHandler
    });
    this.#headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onClick: this.#newPointButtonClickHandler
    });
    this.#allInits.then((results) => {
      if (results.every((result) => result.status === 'fulfilled')) {
        this.#headerPresenter.init();
      }
    });
    this.#boardPresenter.init();
  }
}
