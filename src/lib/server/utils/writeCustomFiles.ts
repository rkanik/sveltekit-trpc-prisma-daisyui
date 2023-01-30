import { writeFile } from 'fs'
import { mkdirIfNotExistsSync } from './mkdirIfNotExistsSync'

import type { CustomFile } from '$lib/$types'
import { writeCustomFile } from './writeCustomFile'

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

export const writeCustomFiles = (files: CustomFile[]) => {
	return Promise.all(
		files.map(async (file) => {
			return writeCustomFile(file)
		})
	)
}
