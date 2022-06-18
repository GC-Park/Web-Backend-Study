import { Request, Response, NextFunction } from 'express'
import mysql, {connectionWithRunFunction} from '../modules/mysql'

interface RequestWithConnection extends Request {
    mysqlConnection?: connectionWithRunFunction
}

export const useMysql = (
    req: RequestWithConnection,
    res: Response,
    next: NextFunction
) => {
    mysql.connect().then((connection)=>{
        req.mysqlConnection = connection
        next()
    }).catch((e:Error)=>{
        next(e)
    }) 
}