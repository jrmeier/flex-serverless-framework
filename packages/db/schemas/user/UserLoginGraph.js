import { schemaComposer } from 'graphql-compose'


// export const buildUserTC = (models) => ({
//   name: 'User',
//   model: models.User,
//   description: 'A user in the system.',
//   canMutate: true,
// })

export const buildUserLogin = () => {
schemaComposer.createObjectTC({
    name: "UserLogin",
    fields: {
      accessToken: 'String',
      user: 'User',
      error: 'String',
    }
  })

  schemaComposer.Mutation.addFields({
    userLogin: {
      name: 'UserLogin',
      type: 'UserLogin',
      description: 'If valid credentials, returns a JWT token.',
      args: {
        email: "String!",
        password: "String!",
        organizationId: "String",
      },
      resolve: async (_, { email, password, organizationId }, { event, db }) => { // eslint-disable-line no-unused-vars

        try {
        const { accessToken, user } = await db.models.User.login(email, password, organizationId)
          return {
            accessToken,
            user
          }
        } catch (e) {
          console.log(e)
          return {
            error: "Invalid credentials",
          }
        }
      },
    },
  })



}
