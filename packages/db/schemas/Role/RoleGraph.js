export const buildRoleGraphTC = (models, removeFields = []) => ({
    name: 'Role',
    model: models.Role,
    description: 'A group of permissions in the system.',
    canMutate: true,
    removeFields,
  })


  export const buildRoleRelations = ({ RoleTC, PermissionTC }) => {
    RoleTC.addRelation('Permission', {
        resolver: () => PermissionTC.getResolver('findById'),
        prepareArgs: {
          _id: (source) => source._id,
        },
        projection: { _id: true },
      })
    }