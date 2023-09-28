export const buildUserTC = (models) => ({
  name: 'User',
  model: models.User,
  description: 'A user in the system.',
  canMutate: true
})

export const buildUserRelations = ({ UserTC, SubscriptionTC, ProgramTC }) => {
  // UserTC.addRelation('subscription', {
  //   resolver: () => SubscriptionTC.mongooseResolvers.findById(),
  //   prepareArgs: {
  //     _id: (source) => source.subscription
  //   },
  //   projection: { subscription: 1 }
  // })
}
