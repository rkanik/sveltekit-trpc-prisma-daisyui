import type { z, zCustomFile } from '$lib/zod'
import type { Attachment, User, UserAvatar } from '@prisma/client'
import type { ProjectsRouter } from '$lib/trpc/router/projects.trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

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

// TRPC
// ProjectsRouter
export type ProjectsRouterInput = inferRouterInputs<ProjectsRouter>
export type ProjectsRouterOutput = inferRouterOutputs<ProjectsRouter>
export type TrpcProjects = ProjectsRouterOutput['list']
export type TrpcProject = TrpcProjects[number]
