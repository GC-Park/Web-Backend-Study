import { connectionWithRunFunction as connection } from '../modules/mysql'
import bcrypt from 'bcrypt'
import exp from 'constants'
import JWT from 'jsonwebtoken'

// 로그인(토큰 발급) POST/auth
//     -로그인

const postAuth = async (
    params: { id: string; password: string },
    mysql: connection
) => {
    const { id, password } = params

    const selectHashedPassword = await mysql.run(
        'SELECT password FROM users WHERE id=?;',
        [id]
    )

    const isEqual = await bcrypt.compare(
        password,
        selectHashedPassword[0].password
    )

    if (!isEqual) {
        throw new Error('E2000')
    }

    const payload = {id};
    const secret = 'web-study'
    const token = JWT.sign(payload, secret)

    return {
        status: 201,
        data: {
            token,
        },
    }
}

export default {
    postAuth,
}
