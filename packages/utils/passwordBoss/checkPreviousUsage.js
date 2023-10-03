export function checkPreviousUsage ({
  hashedPassword,
  userPasswordHistory,
  currentPassword,
  repeatLimit =3 
}) {
  if (
    userPasswordHistory
      .splice(0, repeatLimit)
      .find(x => x.hashedPassword === hashedPassword) || currentPassword === hashedPassword
  ) {
    throw new Error('Password cannot be reused')
  }
}
