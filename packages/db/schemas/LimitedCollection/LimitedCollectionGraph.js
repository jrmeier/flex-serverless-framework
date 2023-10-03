

export const buildLimitedCollectionGraphTC = (models, removeFields = []) => ({
    name: 'LimitedCollection',
    model: models.Organization,
    description: 'A collection in the system.',
    canMutate: true,
    removeFields,
  })