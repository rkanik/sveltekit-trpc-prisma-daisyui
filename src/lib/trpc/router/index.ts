import delay from 'delay'
import { initTRPC } from '@trpc/server'
import { users } from './users.trpc'
import { projects } from './projects.trpc'
import type { Context } from '$lib/trpc/context'

export const t = initTRPC.context<Context>().create()

export const router = t.router({
	users,
	projects,
	greeting: t.procedure.query(async () => {
		await delay(500) // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
	})
})

export type Router = typeof router
