import { jwt } from '$lib/server/jwt'
import { getCurrentUser } from '$lib/stores/useAuthStore'

import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

export type Context = inferAsyncReturnType<typeof createContext>
export async function createContext(event: RequestEvent) {
	return { user: getCurrentUser(event, jwt) }
}
