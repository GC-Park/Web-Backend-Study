import express from 'express'
import mysql, { connectionWithRunFunction } from '../src/modules/mysql'
import { Request, Response, NextFunction } from 'express'

interface RequestWithConnection extends Request {
    mysqlConnection: connectionWithRunFunction
}

const router = express.Router()

type filedataType = {
    id: string
    password: string
    name: string
    age: number
}[]

//users: 집합(컬렉션)
// /users/2/name 예시

// GET / users: users의 모든 정보 읽기 (컬렉션 리스트 읽기)
router.get('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    throw new Error('인위적인 에러')

    const testConnection = req.mysqlConnection
    console.log('test connection : ', testConnection)

    const connection = req.mysqlConnection
    const selectData = await connection.run(`SELECT * FROM users;`)

    // const datas = fs.readFileSync('./src/public/data.json').toString('utf-8')
    res.send(selectData)
})

// GET /users/5: users의 한 개체의 정보 읽기
router.get('/users/:userIdx', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    const { userIdx } = req.params
    const connection = req.mysqlConnection
    const [selectUserResult] = await connection.run(
        `SELECT * FROM users WHERE idx = ?;`,
        [userIdx]
    )

    // const datas = fs.readFileSync('./src/public/data.json').toString('utf-8')
    res.send(selectUserResult)
})

// POST /users: users에 한 개체를 추가
router.post('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    const { id, password, name, age } = req.body
    const connection = req.mysqlConnection
    const inserResult = await connection.run(
        `INSERT INTO users (id, password, name, age) VALUES (?, ?, ?, ?)`,
        [id, password, name, age]
    )

    console.log(inserResult)
})

// PUT /users: users 컬렉션을 전부 수정하겠다. (주로 사용되지는 않는다.)
router.put('/users', async (request: Request, response: Response) => {
    //users 테이블의 모든 정보 제거
    //users AutoIncrement 초기화
    //users 새로운 user 정보를 다수 추가
})

// PUT /users/5: users 컬렉션에 있는 5번 user 정보를 덮어쓰기 하겠다.
router.put('/users/:userIdx', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    const { userIdx } = req.params
    const { id, password, name, age } = req.body
    const connection = req.mysqlConnection
    try {
        await connection.beginTransaction()
        await connection.run(
            `UPDATE users SET id=?, password=?, name=?, age=? WHERE idx=?;`,
            [id, password, userIdx]
        )
        await connection.run(`UPDATE users SET name=?, age=? WHERE idx=?;`, [
            id,
            password,
            userIdx,
        ])
        await connection.commit()
    } catch (e) {
        await connection.rollback
    }
})

// DELETE /users: users 컬렉션을 전부 제거하겠다. (위험한 방법.)
router.delete('/users', async (request: Request, response: Response) => {
    const req = request as RequestWithConnection
    const res = response

    const connection = req.mysqlConnection
    await connection.run(`DELETE FROM users;`)
})

// DELETE /users/5: users 컬렉션에 있는 5번 user정보를 제거하겠다.
router.delete(
    '/users/:userIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response

        const { userIdx } = req.params
        const connection = req.mysqlConnection
        await connection.run(`DELETE FROM users WHERE idx=?`, [userIdx])
    }
)

export default router

// RESTfUL
// PATCH, 디자인 규격이 좀 다른 경우가 존재 O
