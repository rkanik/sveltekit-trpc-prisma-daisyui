import { z } from 'zod'
export { z }

export const zCustomFile = z.object({
	ext: z.string(),
	name: z.string(),
	type: z.string(),
	size: z.number(),
	base64: z.string(),
	encoding: z.enum(['base64']).default('base64'),
	lastModified: z.number(),
	upload: z.object({
		dir: z.string(),
		name: z.string()
	})
})

export const zAttachment = z.object({
	id: z.number(),
	src: z.string(),
	large: z.string().nullable(),
	medium: z.string().nullable(),
	thumbnail: z.string().nullable(),
	base64: z.string().nullable()
})

export const zProjectAttachment = z.object({
	id: z.number(),
	projectId: z.number(),
	attachmentId: z.number(),
	attachment: zAttachment
})
