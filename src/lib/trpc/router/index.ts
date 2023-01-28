import delay from 'delay'

import { t } from '$lib/trpc/server'
import { tags } from './tags.trpc'
import { users } from './users.trpc'
import { projects } from './projects.trpc'

export const router = t.router({
	tags,
	users,
	projects,
	greeting: t.procedure.query(async () => {
		await delay(500) // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
	})
})

export type Router = typeof router
