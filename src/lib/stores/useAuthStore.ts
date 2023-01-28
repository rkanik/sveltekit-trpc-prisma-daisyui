import { writable, type Updater } from 'svelte/store'

import type { User } from '@prisma/client'
import type { JWT } from '$lib/server/jwt'
import type { RequestEvent } from '@sveltejs/kit'
import { onDestroy } from 'svelte'
import { browser } from '$app/environment'

type AuthStore = {
	user?: User
	token?: string
}

const store = writable<AuthStore>({
	user: undefined,
	token: undefined
})
console.log('created auth store')

export const getCurrentUser = (event: RequestEvent, jwt?: JWT) => {
	const [user, token] = (() => {
		// already have the user
		if (event.locals.user) return [event.locals.user, event.locals.token]
		if (!jwt) return []

		const token =
			event.cookies?.get('token') ||
			event.request?.headers?.get('authorization')?.replace('Bearer ', '')

		// no token in cookies or request headers
		if (!token) return []

		try {
			const user = jwt.verify(token, jwt.secret) as User

			event.locals.user = user
			event.locals.token = token

			return [user, token]
		} catch (_) {
			return []
		}
	})()

	console.log('getCurrentUser', { id: user?.id, token: !!token })
	store.set({ user, token })
	return user
}

export const useAuthStore = () => {
	// if (browser) {
	// 	const unsubscribe = store.subscribe(($auth) => {
	// 		console.log('useAuthStore::subscribe', { id: $auth.user?.id, token: !!$auth.token })
	// 	})
	// 	onDestroy(() => {
	// 		console.log('useAuthStore::onDestroy')
	// 		unsubscribe()
	// 	})
	// }

	const update = (data: AuthStore | Updater<AuthStore>) => {
		if (typeof data === 'function') {
			store.update(data)
			return
		}
		store.update(($auth) => {
			Object.entries(data).forEach(([key, value]) => {
				;($auth as any)[key] = value
			})
			return $auth
		})
	}

	const updateKeep = (data: AuthStore) => {
		store.update(($auth) => {
			Object.entries(data).forEach(([key, value]) => {
				;($auth as any)[key] = value || ($auth as any)[key]
			})
			return $auth
		})
	}

	return {
		update,
		updateKeep,
		set: store.set,
		subscribe: store.subscribe
	}
}
