import express from "express";
import type {Router} from 'express'
import AuthenticationController from "./controller";
import { restrictedToAuthenticatedUser } from "../middleware/auth-middleware";

export const authRouter: Router = express.Router()

const authenticationController = new AuthenticationController()

authRouter.post('/sign-up', authenticationController.handleSignup.bind(authenticationController))
authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController))

authRouter.get('/me', restrictedToAuthenticatedUser(), authenticationController.handleMe.bind(authenticationController))
