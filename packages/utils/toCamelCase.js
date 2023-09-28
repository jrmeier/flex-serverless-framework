export const toCamelCase = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

export const toSnakeCase = (s, sep='-') => {
  return s.replace(/([A-Z])/g, ($1) => {
    return "-" + $1.toLowerCase();
  });
}