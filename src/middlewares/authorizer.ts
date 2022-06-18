import { Request, Response, NextFunction} from 'express';
import { connectionWithRunFunction } from '../modules/mysql';
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface ReqeustWithConnection extends Request {
  mysqlConnection?:connectionWithRunFunction
}

export const authorizer = (req: ReqeustWithConnection, res:Response, next:NextFunction)=>{
  const {authorization: bearerToken} = req.headers
  const {mysqlConnection:connection} = req
  const token = bearerToken?.replace('Bearer ', '') || ''

  const secret = process.env.JWT_SECRET as string

  let payload = {}
  try {
    payload = JWT.verify(token, secret)
  } catch (e) {
    throw new Error('E3000')
  }

  const {id, iat} = payload as any

  connection?.run('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [id]).then((selectCountResult: {count:number}[]) => {
    const { count } = selectCountResult[0]
    if(count >= 1){
      next()
    } else {
      throw new Error('E3000')
    }
  }).catch((e:Error)=>{
    next(e)
  })
}


//ssh 연결 프로그램 - putty   원격 연결 프로그램