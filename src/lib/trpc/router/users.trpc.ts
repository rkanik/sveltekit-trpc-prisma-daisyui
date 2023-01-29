import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'
import { useLogger } from '$lib/trpc/middlewares/useLogger'
import { useAuth } from '$lib/trpc/middlewares/useAuth'
import { zCustomFile } from '$lib/zod'
import { writeCustomFile } from '$lib/server/utils/writeCustomFile'

import type { User } from '@prisma/client'

export const users = t.router({
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
				src: upload.attachment.src.replace(/^static\//, '')
			}

			console.log({ attachmentData })

			let userAvatar = await prisma.userAvatar.findUnique({
				where: { userId: user.id },
				include: { attachment: {} }
			})

			// Have attachment and user Avatar
			if (userAvatar) {
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
