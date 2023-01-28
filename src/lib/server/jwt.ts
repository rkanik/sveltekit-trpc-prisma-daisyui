import { sign, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export const jwt = {
	sign,
	verify,
	secret: JWT_SECRET
}

export type JWT = typeof jwt
