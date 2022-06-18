import mysql, { Connection } from 'mysql2/promise'
import mysqlConfig from '../configs/mysql'
const { ID, PASSWORD, HOST, DB_NAME } = mysqlConfig

const DB_URL = `mysql://${ID}:${PASSWORD}@${HOST}/${DB_NAME}?ssl={"rejectUnauthorized":true}`
//환경변수

// id ev4ky1qheq7w
// password pscale_pw_b0cdH2ErZXqBz4EHcPfGAk8fO_SiSMm7R_Vqqw_M_Ok
// host mdo5v6rbycsb.ap-northeast-2.psdb.cloud
// db parkdb
// ssl = {"rejectUnauthorized":true}

interface customConnection extends Connection {
    run?: Function
}

export interface connectionWithRunFunction extends Connection {
    run: Function
}

// const test = async () => {
//     const pool = await mysql.createPool(DB_URL)
//     pool.getConnection
// }

const connect = async () => {
    const connection: customConnection = await mysql.createConnection(DB_URL)

    const run = async (sql: string, params: any[] = []) => {
        const [rows, field] = await connection.execute(sql, params)
        return rows
    }

    connection.run = run
    return connection as connectionWithRunFunction
}

export default {
    connect,
}
