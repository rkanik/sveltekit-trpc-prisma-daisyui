import { writable } from 'svelte/store'
import { onDestroy } from 'svelte'
import { browser } from '$app/environment'

import type { Updater } from 'svelte/store'
import type { AuthUser } from '$lib/$types'

type AuthStore = {
	token?: string
	user: AuthUser
}

const store = writable<AuthStore>({
	user: undefined,
	token: undefined
})

export const useAuthStore = () => {
	if (browser) {
		const unsubscribe = store.subscribe(($auth) => {
			console.log('useAuthStore::subscribe', {
				user: $auth.user
			})
		})
		onDestroy(() => {
			console.log('useAuthStore::onDestroy')
			unsubscribe()
		})
	}

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
