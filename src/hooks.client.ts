import type { HandleClientError } from '@sveltejs/kit'

export const handle = (event: any) => {
	console.log('handle:hooks.client.ts', event)
}

export const handleError: HandleClientError = ({ error, event }) => {
	console.log('handleError:hooks.client.ts', { error, event })
}
