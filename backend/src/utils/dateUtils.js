export const addDays = (date, days) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};

export const hasExpired = (date) => {
  if (!date) return true;
  return new Date() > new Date(date);
};
