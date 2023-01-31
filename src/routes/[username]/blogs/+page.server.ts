import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { currentParamUser } = await event.parent()
	if (!currentParamUser) return { blogs: [] }
	return {}
}
