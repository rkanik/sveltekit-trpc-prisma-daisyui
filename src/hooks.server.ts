import { routes } from '$lib/routes'
import { redirect } from '@sveltejs/kit'
import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'
import { createTRPCHandle } from 'trpc-sveltekit'
import { createRouteGuard } from 'sveltekit-route-guard'
import { getCurrentUser } from '$lib/server/utils/getCurrentUser'

import type { Handle } from '@sveltejs/kit'

const trpcHandle = createTRPCHandle({
	router,
	createContext,
	onError: ({ type, path, error }) => {
		console.log(`Encountered error while trying to process ${type} @ ${path}:`, error)
	}
})

export const handle: Handle = createRouteGuard({
	routes,
	redirect,
	next: trpcHandle,
	beforeEach(to, event, next) {
		// check if the user is authenticated ot not
		const user = getCurrentUser(event)

		// not authenticated and requires authentication is true
		if (!user && to.meta?.auth) {
			return next('/login')
		}

		// already authenticated, can't go to /login
		if (user && to.meta?.auth === false) {
			return next('/')
		}

		// no guard, continue the request
		return next()
	}
})
