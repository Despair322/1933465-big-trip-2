import dayjs from 'dayjs';

const validateEventForm = (state) => {
  if (!state.destination.id) {
    return false;
  }
  if (!state?.dateFrom?.getTime() || !state?.dateTo?.getTime()) {
    return false;
  }
  if (dayjs(state.dateFrom).isAfter(state.dateTo) || dayjs(state.dateTo).isSame(state.dateFrom)) {
    return false;
  }
  if (!state.basePrice.toString().trim() || state.basePrice <= 0 || isNaN(state.basePrice)) {
    return false;
  }
  return true;
};

export { validateEventForm };
