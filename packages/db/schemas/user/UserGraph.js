export const buildUserTC = (models) => ({
  name: 'User',
  model: models.User,
  description: 'A user in the system.',
  canMutate: true,
})

export const buildUserRelations = ({ UserTC }) => {
  // UserTC.addRelation('roles', {
  //   type: () => [UserTC.schemaComposer.getOTC('Role').getType()],
  //   prepareArgs: {
  //     filter: (source) => ({ userId: source._id, organizationId: source.organizationId }),
  //   },
  //   projection: { _id: true, organizationId: true },
  // })

  
}
