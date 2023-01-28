import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

import type { User } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

export type Context = inferAsyncReturnType<typeof createContext>
export async function createContext(event: RequestEvent): Promise<{
	user?: Pick<User, 'id' | 'email'>
}> {
	if (event.locals.user) {
		return {
			user: event.locals.user
		}
	}

	const token =
		event.cookies.get('token') ||
		event.request.headers.get('authorization')?.replace('Bearer ', '')

	if (!token) return {}

	try {
		return {
			user: verify(token || '', JWT_SECRET) as Pick<User, 'id' | 'email'>
		}
		//
	} catch {
		return {}
	}
}
