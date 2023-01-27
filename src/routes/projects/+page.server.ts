import { trpc } from '$lib/trpc/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	return {
		projects: (await trpc(event)).projects.list()
	}
}
