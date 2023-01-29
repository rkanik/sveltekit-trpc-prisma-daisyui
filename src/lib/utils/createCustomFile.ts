import type { CustomFile } from '$lib/$types'

export const createCustomFile = async (
	file: File,
	upload: CustomFile['upload']
): Promise<CustomFile | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onloadend = async () => {
			if (reader.result) {
				const ext = file.name.split('.').pop() || ''
				upload.name = upload.name.replace('{ext}', ext)
				return resolve({
					ext,
					upload,
					name: file.name,
					type: file.type,
					size: file.size,
					encoding: 'base64',
					base64: reader.result as string,
					lastModified: file.lastModified
				})
			}
			resolve(null)
			console.log('createCustomFile::error', {
				message: 'File read result is null'
			})
		}
		reader.onerror = () => {
			resolve(null)
			console.log('createCustomFile::error', {
				message: 'Error while reading file'
			})
		}
		reader.readAsDataURL(file)
	})
}
