import { writeFile } from 'fs'
import { mkdirIfNotExistsSync } from './mkdirIfNotExistsSync'
import sharp from 'sharp'

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

type Options = {
	id?: number | string
}

const replacePlaceholders = (str: string, opts?: Options) => {
	let { id } = opts || {}
	if (id) {
		id = id.toString().padStart(5, '0')
		return str.replaceAll('{id}', id)
	}
	return str.replaceAll('{date}', Date.now().toString())
}

export const writeCustomFile = async (file: CustomFile, opts?: Options) => {
	return new Promise<WrittenCustomFile>((resolve) => {
		file.upload.dir = replacePlaceholders(file.upload.dir, opts)
		file.upload.name = replacePlaceholders(file.upload.name, opts)

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
					attachment: {
						src: path.replace(/^static/, '')
					}
				})
			}
		)
	})
}
