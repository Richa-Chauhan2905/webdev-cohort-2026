import type {NextFunction, Request, Response} from 'express'
import { verfiyUserToken } from '../auth/utils/token'

export function authenticationMiddleware() {
    return function(req: Request,res:Response, next:NextFunction){
        const header = req.headers['authorization']
        if(!header) next()

        if(!header?.startsWith('Bearer')){
            return res.status(400).json({ error: 'authorization header must start with bearer'})
        }

        const token = header?.split(' ')[1]

        if(!token) return res.status(400).json({ error: 'authorization header must start with bearer and followed by token'})
        
        const user = verfiyUserToken(token)

        //@ts-ignore
        req.user = user

        next()
    }
}

export function restrictedToAuthenticatedUser(){
    return function (req:Request, res: Response, next:NextFunction) {
        //@ts-ignore
        if(!req.user) return res.status(401).json({ errpr: 'Authentication Required' }) 
        
        return next()
    }
}