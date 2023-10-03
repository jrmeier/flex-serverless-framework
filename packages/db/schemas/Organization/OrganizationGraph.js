export const buildOrganizationGraphTC = (models, removeFields = []) => ({
    name: 'Organization',
    model: models.Organization,
    description: 'A organization in the system.',
    canMutate: true,
    removeFields,
  })