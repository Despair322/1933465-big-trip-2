import BoardPresenter from './board-presenter';
import HeaderPresenter from './header-presenter';

export default class AppPresenter {
  #headerPresenter = null;
  #boardPresenter = null;

  #store = null;
  #boardContainer = null;
  #headerContainer = null;

  #initsResult = null;

  constructor({ store, initsResult }) {
    this.#store = store;
    this.#initsResult = initsResult;
    this.#findContainers();
  }

  init() {
    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#boardContainer,
      store: this.#store,
      initsResult: this.#initsResult,
      onNewPointDestroy: this.#newPointFormCloseHandler
    });
    this.#headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      store: this.#store,
      onClick: this.#newPointButtonClickHandler
    });
    this.#initsResult.then((results) => {
      if (results.every((result) => result.status === 'fulfilled')) {
        this.#headerPresenter.init();
      }
    });
    this.#boardPresenter.init();
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
}
