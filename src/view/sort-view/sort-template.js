function createSortItemTemplate(type, isActive, isChecked) {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
              <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}"
              ${isChecked ? 'checked' : ''}
              ${isActive ? '' : 'disabled'}
              data-sort-type=${type}>
              <label class="trip-sort__btn" for="sort-${type}">${type}</label>
            </div>`;

}

export function createSortTemplate(sort) {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sort.map(({ type, isActive }, index) => createSortItemTemplate(type, isActive, index === 0)).join('')}

          </form>`;
}
