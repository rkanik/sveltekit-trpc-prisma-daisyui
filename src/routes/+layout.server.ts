import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const context = await createContext(event)
	if (!context.user) return { user: undefined, token: undefined }

	const user = await router.createCaller(context).users.me()
	return { user, token: context.token }
}
