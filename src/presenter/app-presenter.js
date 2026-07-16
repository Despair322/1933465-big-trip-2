import BoardPresenter from './board-presenter';
import HeaderPresenter from './header-presenter';

export default class AppPresenter {
  #headerPresenter = null;
  #boardPresenter = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #formModel = null;

  #boardContainer = null;
  #headerContainer = null;

  #allInits = null;

  constructor({pointsModel, offersModel, destinationsModel, filterModel, formModel, allInits}) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#formModel = formModel;
    this.#allInits = allInits;
    this.#findContainers();
  }

  #findContainers(){
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerContainer = document.querySelector('.trip-main');
  }


  init(){
    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#boardContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel,
      formModel: this.#formModel,
    });
    this.#headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      formModel: this.#formModel,
    });
    this.#allInits.finally(() => this.#headerPresenter.init());
    this.#boardPresenter.init();

  }

}
