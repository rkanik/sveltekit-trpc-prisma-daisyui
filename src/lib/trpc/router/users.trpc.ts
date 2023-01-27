import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'

export const users = t.router({
	list: t.procedure.query(() => {
		return prisma.user.findMany()
	})
})
