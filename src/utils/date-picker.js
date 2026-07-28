import flatpickr from 'flatpickr';
import { getMaxAllowedDate, getMinAllowedDate } from './utils';

function initDatePickers(elementStart, elementEnd, state, onStartDateChange, onEndDateChange) {
  const commonOptions = {
    dateFormat: 'd/m/y H:i',
    enableTime: true,
    // eslint-disable-next-line camelcase
    time_24hr: true,
    locale: { firstDayOfWeek: 1 },
  };

  const datepickerStart = flatpickr(
    elementStart,
    {
      ...commonOptions,
      defaultDate: state.dateFrom,
      onClose: onStartDateChange,
      maxDate: getMaxAllowedDate(state.dateTo)
    },
  );

  const datepickerEnd = flatpickr(
    elementEnd,
    {
      ...commonOptions,
      defaultDate: state.dateTo,
      onClose: onEndDateChange,
      minDate: getMinAllowedDate(state.dateFrom),
    },
  );
  return { datepickerStart, datepickerEnd };
}

export { initDatePickers };
