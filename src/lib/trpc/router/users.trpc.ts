import { unlink } from 'fs'
import { t } from '$lib/trpc/server'
import { z, zCustomFile } from '$lib/zod'
import { prisma } from '$lib/server/prisma'
import { useAuth } from '$lib/trpc/middlewares/useAuth'
import { useLogger } from '$lib/trpc/middlewares/useLogger'
import { writeCustomFile } from '$lib/server/utils/writeCustomFile'

import type { User } from '@prisma/client'

export const users = t.router({
	me: t.procedure
		.use(useLogger)
		.use(useAuth)
		.query(({ ctx }) => {
			const user = ctx.user as User
			return prisma.user.findUnique({
				where: { id: user.id },
				include: {
					userAvatar: {
						include: {
							attachment: {}
						}
					}
				}
			})
		}),
	findUnique: t.procedure
		.use(useLogger)
		.use(useAuth)
		.input(
			z.object({
				where: z.object({
					id: z.number().optional(),
					email: z.string().optional(),
					username: z.string().optional()
				})
			})
		)
		.query(({ input }) => {
			return prisma.user.findUnique({
				where: input.where,
				include: {
					userAvatar: {
						include: {
							attachment: {}
						}
					}
				}
			})
		}),
	list: t.procedure
		.use(useAuth)
		.use(useLogger)
		.query(() => {
			return prisma.user.findMany({
				include: {
					userAvatar: {
						include: {
							attachment: {}
						}
					}
				}
			})
		}),
	avatarUpdater: t.procedure
		.use(useLogger)
		.use(useAuth)
		.input(zCustomFile)
		.mutation(async ({ input, ctx }) => {
			const user = ctx.user as User

			const upload = await writeCustomFile(input)
			if (upload.error) return null

			const attachmentData = {
				name: input.name,
				size: input.size,
				src: upload.attachment.src.replace(/^static/, '')
			}

			let userAvatar = await prisma.userAvatar.findUnique({
				where: { userId: user.id },
				include: { attachment: {} }
			})

			// Have attachment and user Avatar
			if (userAvatar) {
				const oldAvatarPath = `static${userAvatar.attachment.src}`
				unlink(oldAvatarPath, (err) => {
					if (err) console.log(`unlink::${oldAvatarPath}`, err)
				})

				const attachment = await prisma.attachment.update({
					data: attachmentData,
					where: { id: userAvatar.attachmentId }
				})
				userAvatar.attachment = attachment
				return userAvatar
			}

			// Creating new attachment and userAvatar
			const attachment = await prisma.attachment.create({ data: attachmentData })
			userAvatar = await prisma.userAvatar.create({
				include: { attachment: {} },
				data: { userId: user.id, attachmentId: attachment.id }
			})

			return userAvatar
		})
})
