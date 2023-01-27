import { trpc } from '$lib/trpc/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	return {
		users: (await trpc(event)).users.list()
	}
}
