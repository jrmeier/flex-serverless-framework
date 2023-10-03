import jwt from 'jsonwebtoken';
export const verifyJWT = (token, secret, options) => {
    return jwt.verify(token, secret, options);
}