import type { z, zCustomFile } from '$lib/zod'

export type CustomFile = z.infer<typeof zCustomFile>
