
import {Request, Response, NextFunction, Express} from 'express'
import path from 'path'
import mysql, { connectionWithRunFunction } from '../modules/mysql'
import { apiConfigType, apiConfigsType} from '../configs/api'
import {authorizer} from '../middlewares/authorizer'

interface RequestWithConnection extends Request {
  mysqlConnection: connectionWithRunFunction
}

const registerAllApis = async (app:Express, configs:apiConfigsType) => {
  // app.get('url', (req, res,next)=>{})
  for (const apiName in configs) {
    const apiConfig: apiConfigType = configs[apiName]

    const {path: urlPath, method, handlerPath, handlerName, authorizer: isRequireAuthorizer} = apiConfig

    // __dirname = ..../TODO_API/src/controllers
    const apiModulePath = path.join(__dirname, '../', '../', handlerPath)
    const { default:apiModule } = await import(apiModulePath)
    const handlerFunction: (params:any, mysql:any) => Promise<any> = apiModule[handlerName]


    const APIHandler = (request:Request, response:Response, next:NextFunction)=>{
      const req = request as RequestWithConnection
      const res = response

      const params = req.body
      const connection = req.mysqlConnection

      handlerFunction(params, connection).then((returnObj:{status: number, data:{[key:string]:any}})=>{
        const {status, data} = returnObj
        
        res.status(status)
        res.json(data)
      }).catch(e=>next(e))
    }

    isRequireAuthorizer
    ? app[method](urlPath, authorizer, APIHandler)
    : app[method](urlPath, APIHandler)
  }
}

export default {
  registerAllApis
}