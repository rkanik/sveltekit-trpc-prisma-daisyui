import { t } from '$lib/trpc/server'
import { TRPCError } from '@trpc/server'

export const useAuth = t.middleware(async ({ next, ctx }) => {
	if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is unauthorized.' })
	return next()
})
