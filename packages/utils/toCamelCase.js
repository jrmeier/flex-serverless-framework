export const toCamelCase = (s) => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
  .replace('-', '')
  .replace('_', ''))

export const toSnakeCase = (s, sep = '-') => s.replace(/([A-Z])/g, ($1) => `${sep}${$1.toLowerCase()}`)
