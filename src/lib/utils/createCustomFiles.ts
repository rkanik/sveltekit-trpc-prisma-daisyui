import type { CustomFile } from '$lib/$types'
import { createCustomFile } from './createCustomFile'

export const createCustomFiles = async (
	filelist: FileList | File[],
	upload: CustomFile['upload']
) => {
	return (
		await Promise.all(
			Array.from(filelist).map((file) => {
				return createCustomFile(file, upload)
			})
		)
	).filter((res) => res !== null) as unknown as Promise<CustomFile[]>
}
