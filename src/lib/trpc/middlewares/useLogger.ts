import { t } from '$lib/trpc/server'
import { dayjs } from '$lib/dayjs'

export const useLogger = t.middleware(async ({ path, type, next }) => {
	const start = Date.now()
	const result = await next()
	const ms = Date.now() - start
	console.log(
		`${dayjs().format('hh:mm:ss')} ${result.ok ? 'OK' : 'ERR'} ${type} ${path} - ${ms}ms`
	)
	return result
})
