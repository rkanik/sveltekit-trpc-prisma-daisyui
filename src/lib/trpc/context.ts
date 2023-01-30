import { getCurrentUser } from '$lib/server/utils/getCurrentUser'

import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

export type Context = inferAsyncReturnType<typeof createContext>
export async function createContext(event: RequestEvent) {
	return {
		user: getCurrentUser(event),
		token: event.cookies.get('token')
	}
}
