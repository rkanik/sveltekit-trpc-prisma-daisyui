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

export type BaseOption = Record<string, unknown>
export type BaseOptions = BaseOption[] | (() => Promise<BaseOption[]>)

export type BaseField = {
	name: string
	type: 'text' | 'number' | 'tel' | 'email' | 'file' | 'textarea' | 'combobox'
	label?: string
	class?: string
	placeholder?: string
	options?: BaseOptions
	prefix?: string
	suffix?: string
	combobox?: any
	multiple?: boolean
	accept?: string
}

// TRPC
// ProjectsRouter
export type ProjectsRouterInput = inferRouterInputs<ProjectsRouter>
export type ProjectsRouterOutput = inferRouterOutputs<ProjectsRouter>
export type TrpcProjects = ProjectsRouterOutput['list']
export type TrpcProject = TrpcProjects[number]
export type TrpcCreateProject = ProjectsRouterInput['create']
