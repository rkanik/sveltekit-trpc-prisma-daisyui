export const routes = [
	{
		pathname: '/projects',
		meta: {
			auth: true
		}
	},
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
]
