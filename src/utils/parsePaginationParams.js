const parseNumber = (unknow, defaultNumber) => {
  if (typeof unknow !== 'string') return defaultNumber;

  const parsedNumber = parseInt(unknow);
  if (Number.isNaN(parsedNumber) || parsedNumber <= 0) return defaultNumber;

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 4),
  };
};
