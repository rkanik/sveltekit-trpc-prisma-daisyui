import type { z, zCustomFile } from '$lib/zod'
import type { Attachment, User, UserAvatar } from '@prisma/client'

export type CustomFile = z.infer<typeof zCustomFile>

export type Nope = null | undefined

export type AuthUserAvatar =
	| (UserAvatar & {
			attachment: Attachment
	  })
	| Nope

export type AuthUser =
	| (User & {
			userAvatar: AuthUserAvatar
	  })
	| Nope
