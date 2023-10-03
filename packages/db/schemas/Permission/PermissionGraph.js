export const buildPermissionGraphTC = (models, removeFields = []) => ({
    name: 'Permission',
    model: models.Permission,
    description: 'A permission from a role in the system.',
    canMutate: true,
    removeFields,
  })

