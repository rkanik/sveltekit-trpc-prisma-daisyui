import { writeFile } from 'fs'
import { mkdirIfNotExistsSync } from './mkdirIfNotExistsSync'

import type { CustomFile } from '$lib/$types'

type WrittenCustomFileError = {
	error: true
	message: string
}

type WrittenCustomFileSuccess = {
	error: false
	message: string
	attachment: {
		src: string
	}
}

type WrittenCustomFile = WrittenCustomFileError | WrittenCustomFileSuccess

export const writeCustomFile = async (file: CustomFile) => {
	return new Promise<WrittenCustomFile>((resolve) => {
		mkdirIfNotExistsSync(file.upload.dir)
		const path = `${file.upload.dir}/${file.upload.name}`
		return writeFile(
			path,
			file[file.encoding]?.replace(/^data:([A-Za-z-+/]+);base64,/, '') || '',
			file.encoding,
			(err) => {
				if (err) {
					return resolve({
						error: true,
						message: err.message || ''
					})
				}
				return resolve({
					error: false,
					message: 'File saved',
					attachment: { src: path }
				})
			}
		)
	})
}
