import express, {
    ErrorRequestHandler,
    Handler,
} from 'express'
import cors from 'cors'
// import { connect } from './src/modules/mysql'

import { useMysql } from './middlewares/useMysql'
import controllers from './controllers'
import apiConfigs from './configs/api'
import {errorHandler} from './middlewares/errorHandler'


const app = express()
const PORT = 3714
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // form data를 받을 때
app.use(express.json())
app.use(cors())

app.use(useMysql)

controllers.registerAllApis(app, apiConfigs).then(()=>{
    app.use(errorHandler)  
    app.listen(PORT, () =>
        console.log(`Example app listening at http://localhost:${PORT}`)
    )
}).catch(e => {
    console.error(e)
    process.exit(-1)
})

// controller 계층(함수): 
// 모든 API들을 설정값만 가져 와서 전부 등록이 가능한 함수
// Async wrapper => (req, res, next)
// 변수, 응답 (req, res X): (params, mysql) => return 


// app.get('/err-test', (req, res) => {
//     throw new Error('갑작스러운 에러')
//     res.send({
//         text: 'hello',
//     })
// })



// RESTful 디자인 규격

// app.post('/user', (req, res, next) => {
//     const datas = JSON.parse(
//         fs.readFileSync('./src/public/data.json').toString('utf-8')
//     )
//     datas.push(req.body)
//     fs.writeFileSync('./src/public/data.json', JSON.stringify(datas))
// })

// app.put('/user', (req, res, next) => {
//     let datas = JSON.parse(
//         fs.readFileSync('./src/public/data.json').toString('utf-8')
//     )
//     for (const data in datas) {
//         if (req.body.index == data) {
//             delete req.body.index
//             datas.splice(Number(data), 1, req.body)
//             break
//         }
//     }
//     fs.writeFileSync('./src/public/data.json', JSON.stringify(datas))
//     res.send('Put request')
// })

// app.delete('/user', (req, res, next) => {
//     let datas = JSON.parse(
//         fs.readFileSync('./src/public/data.json').toString('utf-8')
//     )
//     for (const data in datas) {
//         if (req.body.index == data) {
//             datas.splice(Number(data), 1)
//             break
//         }
//     }
//     fs.writeFileSync('./src/public/data.json', JSON.stringify(datas))
//     res.send('Delete request')
// })

// app.get('/', (req, res, next) => {
//     res.json({
//         data: true,
//     })
//     next()
// })

// app.get('/test', (req, res) => {
//     res.json({
//         data: 'test true',
//     })
// })

// app.use((err: any, req: any, res: any, next: any) => {
//     res.json({
//         data: false,
//     })
// })

// app.post('/login/:fruit', (req, res) => {
//     res.json({
//         pathParameter: req.params,
//         bodyParameter: req.body,
//         queryParameter: req.query,
//     })
// })

// app.post('/signup', (req, res) => {
//     console.log(req.body.fruit)
//     res.json({
//         data: 'check signup',
//     })
// })

// app.post('/logout', (req, res) => {
//     res.json({
//         data: 'check logout',
//     })
// })

// // plus
// app.post('/plus', (req, res) => {
//     console.log(req.body)
//     const result = req.body.num1 + req.body.num2
//     res.json({
//         result: result,
//     })
//     // res.json({
//     //     pathParameter: req.params,
//     //     bodyParameter: req.body,
//     //     queryParameter: req.query,
//     // })
// })
// // minus
// app.post('/minus', (req, res) => {
//     console.log(req.query)
//     const result = Number(req.query.num1) - Number(req.query.num2)
//     res.json({
//         result: result,
//     })
//     // res.json({
//     //     pathParameter: req.params,
//     //     bodyParameter: req.body,
//     //     queryParameter: req.query,
//     // })
// })
// //multi
// app.post('/multi/:num1/:num2', (req, res) => {
//     console.log(req.params)
//     const result = Number(req.params.num1) * Number(req.params.num2)
//     res.json({
//         result: result,
//     })
//     // res.json({
//     //     pathParameter: req.params,
//     //     bodyParameter: req.body,
//     //     queryParameter: req.query,
//     // })
// })
// //divide
// app.post('/divide', (req, res) => {
//     console.log(req.body)
//     const result = Number(req.body.num1) / Number(req.body.num2)
//     res.json({
//         result: result,
//     })
//     // res.json({
//     //     pathParameter: req.params,
//     //     bodyParameter: req.body,
//     //     queryParameter: req.query,
//     // })
// })

// app.delete('/delete', (req, res) => {
//     res.json({
//         data: 'check delete',
//     })
// })


// app.use((req, res, next)=>{
//     res.send({
//         success:false
//     })
// })
