export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

export const formatDate = (date: string) => {
  if (date.length < 20) return "";

  const yearMonthDate = date.slice(0, 10);
  const hourMinute = date.slice(11, 16);

  return yearMonthDate + " " + hourMinute;
};
