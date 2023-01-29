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
