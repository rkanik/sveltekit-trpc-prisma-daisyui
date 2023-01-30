import { router } from '$lib/trpc/router'
import { TrpcProjects } from '$lib/$types'
import { createContext } from '$lib/trpc/context'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { currentParamUser } = await event.parent()
	if (!currentParamUser) return { projects: [] }
	return {
		projects: (await router.createCaller(await createContext(event)).projects.list({
			where: { userId: currentParamUser.id }
		})) as TrpcProjects
	}
}
