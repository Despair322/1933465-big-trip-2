import dayjs from 'dayjs';

const validateEventForm = (state) => {
  if (!state.destination.id) {
    return false;
  }
  const from = state?.dateFrom;
  const to = state?.dateTo;
  if (!from || !to || !dayjs(from).isBefore(to)) {
    return false;
  }
  const price = Number(state?.basePrice);
  if (isNaN(price) || price <= 0) {
    return false;
  }
  return true;
};

export { validateEventForm };
