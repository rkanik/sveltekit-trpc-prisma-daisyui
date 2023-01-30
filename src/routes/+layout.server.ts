import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const context = await createContext(event)
	if (!context.user) return { currentUser: undefined, token: undefined }

	const currentUser = await router.createCaller(context).users.me()
	return { currentUser, token: context.token }
}
