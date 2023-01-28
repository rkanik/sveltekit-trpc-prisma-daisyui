import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'
import { useLogger } from '$lib/trpc/middlewares/useLogger'
import { useAuth } from '$lib/trpc/middlewares/useAuth'

export const users = t.router({
	list: t.procedure
		.use(useAuth)
		.use(useLogger)
		.query(() => {
			return prisma.user.findMany()
		})
})
