import bcrypt from 'bcrypt'

import { jwt } from '$lib/server/jwt'
import { prisma } from '$lib/server/prisma'

import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const data = await request.formData()

			const name = data.get('name') as string
			const email = data.get('email') as string
			const password = data.get('password') as string
			const passwordConfirmation = data.get('passwordConfirmation') as string

			if (password !== passwordConfirmation) {
				return { error: "Passwords does't matach" }
			}

			const passwordHash = bcrypt.hashSync(password, 10)

			const user = await prisma.user.create({
				data: {
					name,
					email,
					username: email.split('@').shift() || '',
					password: passwordHash
				},
				select: {
					id: true,
					name: true,
					email: true,
					username: true
				}
			})

			const token = jwt.sign(user, jwt.secret)
			cookies.set('token', token, { path: '/' })

			return { user, token, success: true }
		} catch {
			return { error: 'Authentication failed' }
		}
	}
}
