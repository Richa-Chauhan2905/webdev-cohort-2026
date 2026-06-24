"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = authenticationMiddleware;
exports.restrictedToAuthenticatedUser = restrictedToAuthenticatedUser;
const token_1 = require("../auth/utils/token");
function authenticationMiddleware() {
    return function (req, res, next) {
        const header = req.headers['authorization'];
        if (!header)
            next();
        if (!(header === null || header === void 0 ? void 0 : header.startsWith('Bearer'))) {
            return res.status(400).json({ error: 'authorization header must start with bearer' });
        }
        const token = header === null || header === void 0 ? void 0 : header.split(' ')[1];
        if (!token)
            return res.status(400).json({ error: 'authorization header must start with bearer and followed by token' });
        const user = (0, token_1.verfiyUserToken)(token);
        //@ts-ignore
        req.user = user;
        next();
    };
}
function restrictedToAuthenticatedUser() {
    return function (req, res, next) {
        //@ts-ignore
        if (!req.user)
            return res.status(401).json({ errpr: 'Authentication Required' });
        return next();
    };
}
