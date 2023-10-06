export const buildRoleTC = (models, removeFields = []) => ({
  name: 'Role',
  model: models.Role,
  description: 'A role in the system.',
  canMutate: true,
  removeFields,
})
