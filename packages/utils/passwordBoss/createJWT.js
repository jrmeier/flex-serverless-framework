import jwt from 'jsonwebtoken';

export const createJWT = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
}