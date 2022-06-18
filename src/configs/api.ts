export interface apiConfigType {
  path: string,
  method: 'get' | 'post' | 'put' | 'delete',
  handlerPath: string,
  handlerName: string,
  authorizer: boolean
}

export type apiConfigsType = {[key: string]:apiConfigType}

const apiConfigs:apiConfigsType = {
  getUsers:{
    path: '/users',
    method: 'get',
    handlerPath: './src/api/users.ts',
    handlerName : 'getUsers',
    authorizer: true
  },
  postUsers: {
    path: '/users',
    method: 'post',
    handlerPath: './src/api/users.ts',
    handlerName : 'postUsers',
    authorizer: false
  },
  postAuth:{
    path: '/auth',
    method: 'post',
    handlerPath: './src/api/auth.ts',
    handlerName: 'postAuth',
    authorizer: false
  }
}

export default apiConfigs