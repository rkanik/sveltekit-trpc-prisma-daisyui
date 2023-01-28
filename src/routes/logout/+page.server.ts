import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	event.cookies.delete('token')
	event.locals.user = undefined
	return { success: true }
}
