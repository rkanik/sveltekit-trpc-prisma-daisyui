// import { router } from '$lib/trpc/router'
// import { createContext } from '$lib/trpc/context'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (_event) => {
	// user: await router.createCaller(await createContext(event)).users.findUnique({
	// 	where: { username: event.params.username }
	// })
	return {}
}
