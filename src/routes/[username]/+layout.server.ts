import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	return {
		currentParamUser: await router.createCaller(await createContext(event)).users.findUnique({
			where: { username: event.params.username }
		})
	}
}
