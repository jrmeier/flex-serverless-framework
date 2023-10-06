import { expect } from "vitest"

export const buildUserTC = (models) => ({
  name: 'User',
  model: models.User,
  description: 'A user in the system.',
  canMutate: true,
})

export const buildUserRelations = ({ UserTC }) => {
  // console.log(UserTC.schemaComposer.getOTC('Role').getResolver('Find'))
  // console.log(UserTC.schemaComposer.getOTC('Role'))
  console.log(UserTC.schemaComposer.getOTC('Role').mongooseResolvers.findOne())
  UserTC.addRelation('roles', {
    // type: () => [UserTC.schemaComposer.getOTC('Role').getType()],
    resolver: UserTC.schemaComposer.getOTC('Role').mongooseResolvers.findMany(),
    prepareArgs: {
      filter: (source) => ({ userId: source._id, organizationId: source.organizationId }),
    },
    projection: { _id: true, organizationId: true },
  })
  UserTC.addRelation('organization', {
    // type: () => UserTC.schemaComposer.getOTC('Organization').getType(),
    resolver: UserTC.schemaComposer.getOTC('Organization').mongooseResolvers.findOne(),
    prepareArgs: {
      filter: (source) => ({ _id: source.organizationId }),
    },
    projection: { organizationId: true },
  })

  return UserTC
}
