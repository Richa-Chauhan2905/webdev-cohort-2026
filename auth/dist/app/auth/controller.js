"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const models_1 = require("./models");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const token_1 = require("./utils/token");
class AuthenticationController {
    handleSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const validationResult = yield models_1.signupPayloadModel.safeParseAsync(req.body);
            if (validationResult.error)
                return res.status(400).json({
                    messgae: "body validation failed",
                    error: validationResult.error.issues,
                });
            const { firstName, lastName, email, password } = validationResult.data;
            const userEmailResult = yield db_1.db
                .select()
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
            if (userEmailResult.length > 0)
                return res.status(400).json({
                    error: "duplicate entry",
                    message: `user with email ${email} already exists`,
                });
            const salt = (0, node_crypto_1.randomBytes)(32).toString("hex");
            const hash = (0, node_crypto_1.createHmac)("sha256", salt).update(password).digest("hex");
            const result = yield db_1.db
                .insert(schema_1.usersTable)
                .values({
                firstName,
                lastName,
                email,
                password: hash,
                salt,
            })
                .returning({ id: schema_1.usersTable.id });
            return res.status(201).json({
                message: "user has been created successfully",
                data: { id: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.id },
            });
        });
    }
    handleSignin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = yield models_1.signinPayloadModel.safeParseAsync(req.body);
            if (validationResult.error)
                return res.status(400).json({
                    messgae: "body validation failed",
                    error: validationResult.error.issues,
                });
            const { email, password } = validationResult.data;
            const userSelect = yield db_1.db
                .select()
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
            const user = userSelect[0];
            if (!user)
                return res
                    .status(404)
                    .json({ message: `user with email ${email} does not exist` });
            const salt = user.salt;
            const hash = (0, node_crypto_1.createHmac)("sha256", salt).update(password).digest("hex");
            if (user.password !== hash)
                return res
                    .status(400)
                    .json({ message: `User email or password incorrect` });
            const token = (0, token_1.createUserToken)({ id: user.id });
            return res.json({ message: "Signin Success", data: { token } });
        });
    }
    handleMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const { id } = req.user;
            const [userResult] = yield db_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
            return res.json({
                firstName: userResult === null || userResult === void 0 ? void 0 : userResult.firstName,
                lastName: userResult === null || userResult === void 0 ? void 0 : userResult.lastName,
                email: userResult === null || userResult === void 0 ? void 0 : userResult.email,
                createdAt: userResult === null || userResult === void 0 ? void 0 : userResult.createdAt
            });
        });
    }
}
exports.default = AuthenticationController;
