
const errorConfigs: {[key:string]:{message:string, status:number}} = {
  'E0000':{
    message: '원인을 알 수 없는 에러',
    status: 500
  },
  'E1000':{
    message: '요청 파라미터가 잘못되었습니다.',
    status: 400
  },
  'E2000':{
    message: '비밀번호가 일치하지 않습니다.',
    status: 403
  },
  'E3000':{
    message: '권한이 올바르지 않습니다.',
    status: 403
  }
}

export default errorConfigs