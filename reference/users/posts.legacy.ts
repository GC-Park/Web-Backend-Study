import express from 'express'
import mysql from '../../src/modules/mysql'

import { Request, Response, NextFunction } from 'express'
import { nextTick } from 'process'
import AsyncWapper from '../../src/modules/asyncWrapper';

interface RequestWithConnection extends Request {
    mysqlConnection: any
}

const router = express.Router()

// // 특정 user가 소유하고 있는 게시글 읽기
// const getDocument = async (request, response) => {
//     코드
//     try {
//         DB 쿼리 실행
//     }
//     코드
// }

// // 진입로   관심사의 분리
// router.get(
//     '/users/:userIdx/posts',
//     AsyncWapper.wrap(getDocument)
// )




router.get(
    '/users/:userIdx/posts',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx } = req.params

        const connection = req.mysqlConnection
        const selectUsersPostResult: {
            title: string
            contents: string
            id: string
        }[] = await connection.run(
            `SELECT title, contents, users.id 
        FROM posts
        INNER JOIN users ON posts.author_idx = users.idx
        WHERE posts.author_idx = ?;`,
            [userIdx]
        )

        const responseBodyData = selectUsersPostResult.map((data) => {
            const { title, contents, id: userId } = data
            return { title, contents, userId }
        })
        res.send(responseBodyData)
    }
)

// 특정 유저의 게시글 추가
router.post(
    '/users/:userIdx/posts',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx } = req.params

        const { title, contents } = req.body
        const connection = req.mysqlConnection

        const countUsersResult = await connection.run(
            `SELECT COUNT(*) AS count FROM users WHERE idx=?;`,
            [userIdx]
        )
        // console.log(countUsersResult)
        if (countUsersResult[0].count !== 1) {
            throw new Error('해당되는 idx의 유저가 존재하지 않습니다.')
        }

        await connection.run(
            `INSERT INTO posts (title, contents, author_idx) VALUES (?, ?, ?)`,
            [title, contents, userIdx]
        )
        res.send({
            success: true,
        })
    }
)

//과제

//1. REST 디자인 규격
//PUT 특정 유저의 게시글에서 특정 idx의 게시글 수정
// router.put('/users/:Idx/posts', async (req:any, res) => {
//     const { Idx } = req.params
//     const { title, contents } = req.body
//     const connection = req.mysqlConnection

//     const countUsersResult = await connection.run(
//         `SELECT COUNT(*) AS count FROM posts WHERE idx=?;`,
//         [Idx]
//     )

//     if (countUsersResult[0].count !== 1) {
//         // console.log(countUsersResult)
//         throw new Error('해당되는 idx의 유저가 존재하지 않습니다.')
//     }

//     await connection.run(
//         `UPDATE posts SET title = ?, contents = ? WHERE idx = ?;`,
//         [title, contents, Idx]
//     )

//     res.send({
//         success: true,
//     })
// })

router.put(
    '/users/:userIdx/posts/:postIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx, postIdx } = req.params

        const { contents } = req.body
        const connection = req.mysqlConnection

        try {
            const countUsersPost = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE author_idx = ? AND idx = ?`,
                [userIdx, postIdx]
            )
            if (countUsersPost[0].count !== 1) {
                throw new Error('해당 포스트는 존재하지 않습니다.')
            }
            await connection.run(
                'UPDATE posts SET contents = ? WHERE idx = ?',
                [contents, postIdx]
            )

            res.send({
                success: true,
            })
        } catch (e) {
            throw new Error('에러 발생')
            // res.send({
            //     success: false,
            //     errorMessage: `${e}`,
            // })
        }

        // const {
        //     params: {
        //         userIdx, postIdx
        //     },
        //     body: {
        //         contents
        //     },
        //     mysqlConnection: connection
        // } = req
    }
)

//DELETE 특정 유저의 게시글에서 특정 idx의 게시글 삭제
// router.delete('/users/:Idx/posts', async (req: any, res) => {
//     const { Idx } = req.params
//     const connection = req.mysqlConnection

//     const countUsersResult = await connection.run(
//         `SELECT COUNT(*) AS count FROM posts WHERE idx=?;`,
//         [Idx]
//     )

//     if (countUsersResult[0].count !== 1) {
//         // console.log(countUsersResult)
//         throw new Error('해당되는 idx의 유저가 존재하지 않습니다.')
//     }

//     await connection.run(`DELETE FROM posts WHERE idx = ?;`, [Idx])

//     res.send({
//         success: true,
//     })
// })

router.delete(
    '/users/:userIdx/posts/:postIdx',
    async (request: Request, response: Response) => {
        const req = request as RequestWithConnection
        const res = response
        const { userIdx, postIdx } = req.params
        const connection = req.mysqlConnection

        try {
            const countUsers = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE idx = ?`,
                [userIdx]
            )
            if (countUsers[0].count !== 1) {
                throw new Error('해당 사용자는 존재하지 않습니다.')
            }

            const countUsersPost = await connection.run(
                `SELECT COUNT(*) AS count FROM posts WHERE idx = ?`,
                [postIdx]
            )
            if (countUsersPost[0].count !== 1) {
                throw new Error('해당 포스트는 존재하지 않습니다.')
            }
            await connection.run(`DELETE FROM posts WHERE idx=?`, [postIdx])

            res.send({
                success: true,
            })
        } catch (e) {
            res.send({
                success: false,
                errorMessage: `${e}`,
            })
        }
    }
)

//2. useMysql 미들웨어를 만들어서, 커넥션을 req에서 가져오는 형식으로 구현.
// 완료!

export default router
