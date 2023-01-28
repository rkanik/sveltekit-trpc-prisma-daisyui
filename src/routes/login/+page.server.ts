import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '$lib/server/prisma'
import { JWT_SECRET } from '$env/static/private'

import type { Actions } from './$types'
import { useAuthStore } from '$lib/stores/useAuthStore'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const data = await request.formData()
			const email = data.get('email') as string
			const password = data.get('password') as string
			const user = await prisma.user.findUnique({ where: { email } })

			if (!user) {
				return {
					error: 'Account not founc with the email address'
				}
			}

			if (!user.password) {
				return {
					error: 'Password not exist. please login with your registered social account.'
				}
			}

			if (!bcrypt.compareSync(password, user.password)) {
				return {
					error: 'Email or password do not match'
				}
			}

			const token = jwt.sign(user, JWT_SECRET)
			cookies.set('token', token, { path: '/' })

			const auth = useAuthStore()
			auth.set({ user, token })

			return { user, token }
			//
		} catch {
			return { error: 'Authentication failed' }
		}
	}
}
