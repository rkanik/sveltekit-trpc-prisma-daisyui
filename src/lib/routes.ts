import type { Route } from 'sveltekit-route-guard'

export const routes: Route[] = [
	{
		pathname: '/users',
		meta: {
			auth: true
		}
	},
	{
		pathname: '/login',
		meta: {
			auth: false
		}
	},
	{
		pathname: '/signup',
		meta: {
			auth: false
		}
	}
	// {
	// 	pathname: '/[username]'
	// },
	// {
	// 	pathname: '/[username]/projects'
	// }
]
