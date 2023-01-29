import type { User } from '@prisma/client'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token?: string
			user?: User
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
