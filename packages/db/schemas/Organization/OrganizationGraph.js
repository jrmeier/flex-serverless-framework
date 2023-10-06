export const buildOrganizationGraphTC = (models, removeFields = []) => ({
    name: 'Organization',
    model: models.Organization,
    description: 'A organization in the system.',
    canMutate: true,
    removeFields,
  })


export const buildOrganizationRelations = ({ OrganizationTC }) => {
  OrganizationTC.addRelation('roles', {
    resolver: OrganizationTC.schemaComposer.getOTC('Role').getResolver('findMany'),
    prepareArgs: {
      filter: (source) => ({ organizationId: source.organizationId }),
    },
    projection: { _id: true, organizationId: true },
  })
  const wtf = OrganizationTC.schemaComposer.getOTC('User')

  console.log({ wtf })
  OrganizationTC.addRelation('users', {
    resolver: OrganizationTC.schemaComposer.getOTC('User').getResolver('findMany'),
    prepareArgs: {
      filter: (source) => ({ organ: source.organizationId }),
    },
    projection: { organizationId: true },
  })

  
}
  