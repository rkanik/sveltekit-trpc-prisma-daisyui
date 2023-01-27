import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'

export const projects = t.router({
	list: t.procedure.query(() => {
		return prisma.project.findMany()
	})
})
