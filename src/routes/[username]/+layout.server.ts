import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const { currentUser } = await event.parent()
	if (currentUser && currentUser.username === event.params.username) {
		return { currentParamUser: currentUser }
	}

	return {
		currentParamUser: await router.createCaller(await createContext(event)).users.findUnique({
			where: { username: event.params.username }
		})
	}
}
