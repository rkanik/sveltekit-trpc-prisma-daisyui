import type { User } from '@prisma/client'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User
			token?: string
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
