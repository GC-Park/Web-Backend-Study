import express, {Request, Response} from 'express'

const router = express.Router()

interface RequestWithConnection extends Request {
  mysqlConnection: any
}

router.get('/err-test', (req, res) => {
    throw new Error('갑작스러운 에러')
    res.send({
        text: 'hello',
    })
})

router.post('/async', (req, res, next) => {
    const api = async (req: RequestWithConnection, res: Response) => {
      // 로직
      const connection = req.mysqlConnection
      const seletUsersResult = await connection.run(
        `SELECT * FROM users;`
      )
      return {
        data: seletUsersResult
      }
    }


    api(req as RequestWithConnection, res)
        .then((result) => {
            res.json({
                success: true,
                result: result,
            })
        })
        .catch((e) => {
           next(e)
        })
})

export default router
