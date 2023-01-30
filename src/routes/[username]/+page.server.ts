import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	return {
		user: await router.createCaller(await createContext(event)).users.findUnique({
			where: { username: event.params.username }
		})
	}
}
