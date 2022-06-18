import dotenv from 'dotenv'
dotenv.config()

export default {
  ID: process.env.MYSQL_ID,
  PASSWORD: process.env.MYSQL_PASSWORD,
  HOST: process.env.MYSQL_HOST,
  DB_NAME: process.env.MYSQL_DB_NAME
}