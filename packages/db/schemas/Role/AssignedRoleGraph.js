// import { schemaComposer } from 'graphql-compose'




export const buildAssignedRoleTC = (models, removeFields = []) => ({
  name: 'AssignedRole',
  model: models.AssignedRole,
  description: 'A role in the system.',
  canMutate: true,
  removeFields,
})

export const buildAssignedRoleRelations = ({ }) => {

}
