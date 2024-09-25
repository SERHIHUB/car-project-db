const parseBoolean = (unknow) => {
  if (!['true', 'false'].includes(unknow)) return;

  return unknow === 'true' ? true : false;
};

export const parseFilters = (query) => {
  return { paid: parseBoolean(query.paid) };
};
