import { connectionWithRunFunction as connection } from '../../modules/mysql'
import JWT from 'jsonwebtoken'

const getUserInfo = async (params:any, mysql:connection) => {


  // return {
  //   status: 200,
  //   data: userInfo
  // }
}

export {
  getUserInfo
}