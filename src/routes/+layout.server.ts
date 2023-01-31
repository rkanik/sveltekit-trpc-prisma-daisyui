import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { AuthUser } from '$lib/$types'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const context = await createContext(event)
	if (!context.user) return {}
	return {
		token: context?.token,
		currentUser: (await router.createCaller(await createContext(event)).users.me()) as AuthUser
	}
}
