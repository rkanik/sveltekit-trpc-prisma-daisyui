import { z } from 'zod'
import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'
import { useAuth } from '$lib/trpc/middlewares/useAuth'
import { useLogger } from '$lib/trpc/middlewares/useLogger'
import type { User } from '@prisma/client'
import { zCustomFile } from '$lib/zod'
import { writeCustomFile } from '$lib/server/utils/writeCustomFile'

const findOrCreateMany = async (tags: { name: string }[]) => {
	return await Promise.all(
		tags.map(async (tag) => {
			tag.name = tag.name.toLowerCase()
			return await prisma.tag.upsert({
				update: {},
				create: { name: tag.name },
				where: { name: tag.name }
			})
		})
	)
}

export const projects = t.router({
	list: t.procedure
		.use(useAuth)
		.use(useLogger)
		.input(
			z
				.object({
					where: z.object({
						userId: z.number().optional()
					})
				})
				.optional()
		)
		.query(({ ctx, input }) => {
			return prisma.project.findMany({
				orderBy: [{ createdAt: 'desc' }],
				where: {
					deletedAt: null,
					userId: input?.where?.userId || ctx.user?.id
				},
				include: {
					user: {
						include: {
							userAvatar: {
								include: {
									attachment: {}
								}
							}
						}
					},
					projectTags: {
						select: {
							tag: {
								select: {
									name: true
								}
							}
						}
					},
					projectAttachments: {
						include: {
							attachment: {}
						}
					}
				}
			})
		}),
	create: t.procedure
		.use(useAuth)
		.use(useLogger)
		.input(
			z.object({
				name: z.string().min(1, 'Name is required'),
				description: z.string().min(1, 'Description is required'),
				previewUrl: z.string().optional(),
				sourceCodeUrl: z.string().optional(),
				attachments: z.array(zCustomFile).default([]),
				projectTags: z
					.array(
						z.object({
							id: z.number().optional(),
							name: z.string().min(1, "Tag name can't be blank")
						})
					)
					.default([])
			})
		)
		.mutation(async ({ input, ctx }) => {
			const user = ctx.user as User

			const tags = await findOrCreateMany(input.projectTags)
			const project = await prisma.project.create({
				data: {
					userId: user.id,
					name: input.name,
					description: input.description,
					previewUrl: input.previewUrl,
					sourceCodeUrl: input.sourceCodeUrl
				}
			})

			for (const item of input.attachments) {
				const written = await writeCustomFile(item, { id: project.id })
				if (written.error) continue
				const attachment = await prisma.attachment.create({
					data: {
						size: item.size,
						name: item.name,
						src: written.attachment.src
					}
				})
				await prisma.projectAttachment.create({
					data: {
						projectId: project.id,
						attachmentId: attachment.id
					}
				})
			}

			await prisma.projectTag.createMany({
				data: tags.map((tag) => ({
					tagId: tag.id,
					projectId: project.id
				}))
			})

			return prisma.project.findUnique({
				where: { id: project.id },
				include: {
					user: {
						include: {
							userAvatar: {
								include: {
									attachment: {}
								}
							}
						}
					},
					projectTags: {
						select: {
							tag: {
								select: {
									name: true
								}
							}
						}
					},
					projectAttachments: {
						include: {
							attachment: {}
						}
					}
				}
			})
		}),
	delete: t.procedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
		return prisma.project.update({
			where: { id: input.id },
			data: { deletedAt: new Date() }
		})
	})
})

export type ProjectsRouter = typeof projects
