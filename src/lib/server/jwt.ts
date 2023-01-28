import jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

const { sign, verify } = jsonwebtoken

export const jwt = {
	sign,
	verify,
	secret: JWT_SECRET
}

export type JWT = typeof jwt
