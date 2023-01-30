import { jwt } from '$lib/server/jwt'
import type { User } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'

export const getCurrentUser = (event: RequestEvent) => {
	// already have the user
	if (event.locals.user) return event.locals.user

	const token =
		event.cookies?.get('token') ||
		event.request?.headers?.get('authorization')?.replace('Bearer ', '')

	// no token in cookies or request headers
	if (!token) return

	try {
		const user = jwt.verify(token, jwt.secret) as User

		event.locals.user = user
		event.locals.token = token

		return user
	} catch (_) {
		return
	}
}
