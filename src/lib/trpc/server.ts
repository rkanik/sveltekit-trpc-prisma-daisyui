import { initTRPC } from '@trpc/server'
import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

import type { Context } from '$lib/trpc/context'
import type { RequestEvent } from '@sveltejs/kit'

export const t = initTRPC.context<Context>().create()

export const trpc = async (event?: RequestEvent) => {
	return router.createCaller(await createContext(event))
}
