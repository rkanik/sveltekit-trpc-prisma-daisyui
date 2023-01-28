import { jwt } from '$lib/server/jwt'
import { getCurrentUser } from '$lib/stores/useAuthStore'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	return {
		user: getCurrentUser(event, jwt),
		token: event.cookies.get('token')
	}
}
