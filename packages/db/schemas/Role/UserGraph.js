import { schemaComposer } from 'graphql-compose'

export const buildUserTC = (models, removeFields = []) => ({
  name: 'User',
  model: models.User,
  description: 'A user in the system.',
  canMutate: true,
  removeFields,
})

export const buildUserRelations = ({ UserTC }) => {
  // UserTC.addRelation('roles', {
  //   resolver: () => UserTC.schemaComposer.getOTC('Role').getResolver('Find'),
  //   prepareArgs: {
  //     filter: (source) => ({ userId: source._id, organizationId: source.organizationId }),
  //   },
  //   projection: { _id: true, organizationId: true },
  // })

  
}
