import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '$lib/server/prisma'
import { JWT_SECRET } from '$env/static/private'

// import { invalid } from '@sveltejs/kit'
// import { md5 } from 'hash-wasm'
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

			// 👇 replace this with a non-naiive hashing algorithm
			// const passwordHash = await md5(password)

			const passwordHash = bcrypt.hashSync(password, 10)

			const user = await prisma.user.create({
				data: {
					name,
					email,
					password: passwordHash
				},
				select: {
					id: true,
					name: true,
					email: true
				}
			})

			const token = jwt.sign(user, JWT_SECRET)
			cookies.set('token', token, { path: '/' })

			return { user, token, success: true }
		} catch {
			return { error: 'Authentication failed' }
		}
	}
}
