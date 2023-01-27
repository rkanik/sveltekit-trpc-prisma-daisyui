import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'

export const tags = t.router({
	list: t.procedure.query(() => {
		return prisma.tag.findMany()
	})
})
