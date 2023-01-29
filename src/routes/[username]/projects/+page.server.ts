import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	return {
		projects: router.createCaller(await createContext(event)).projects.list()
	}
}
