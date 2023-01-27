import { z } from 'zod'
import { t } from '$lib/trpc/server'
import { prisma } from '$lib/server/prisma'

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

const findMe = async () => {
	return await prisma.user.upsert({
		where: { email: 'rkanik.me@email.com' },
		update: {},
		create: {
			name: 'RK Anik',
			email: 'rkanik.me@email.com'
		}
	})
}

export const projects = t.router({
	list: t.procedure.query(() => {
		return prisma.project.findMany({
			where: { deletedAt: null },
			orderBy: [{ createdAt: 'desc' }],
			include: {
				user: {},
				projectTags: {
					select: {
						tag: {
							select: {
								name: true
							}
						}
					}
				}
			}
		})
	}),
	create: t.procedure
		.input(
			z.object({
				name: z.string().min(1, 'Name is required'),
				description: z.string().min(1, 'Description is required'),
				previewUrl: z.string().optional(),
				sourceCodeUrl: z.string().optional(),
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
		.mutation(async ({ input }) => {
			const me = await findMe()
			const tags = await findOrCreateMany(input.projectTags)
			const project = await prisma.project.create({
				data: {
					userId: me.id,
					name: input.name,
					description: input.description,
					previewUrl: input.previewUrl,
					sourceCodeUrl: input.sourceCodeUrl
				}
			})
			await prisma.projectTag.createMany({
				data: tags.map((tag) => ({
					tagId: tag.id,
					projectId: project.id
				}))
			})

			return prisma.project.findUnique({
				where: { id: project.id },
				include: {
					user: {},
					projectTags: {
						select: {
							tag: {
								select: {
									name: true
								}
							}
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
