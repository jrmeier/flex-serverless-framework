import { v4 as uuidv4 } from 'uuid';


export function generateResetToken (
  expiration = new Date()
    .setMinutes(new Date().getMinutes() + 10)
) {
  return {
    token: uuidv4(),
    expiration,
  }
}
