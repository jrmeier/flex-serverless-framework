export async function isPasswordExpired (
  daysToExpire,
  passwordLastUpdated,
  dateToCompare = new Date(),
) {
  const expirationDate = new Date(passwordLastUpdated) + new Date(new Date(passwordLastUpdated).getDate() + daysToExpire)

  if (expirationDate <= dateToCompare) {
    return true
  }
  return false
}
