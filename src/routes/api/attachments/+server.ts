import { json } from '@sveltejs/kit'
import { existsSync, mkdirSync, writeFile } from 'fs'

import type { CustomFile } from '$lib/$types'
import type { RequestHandler } from '@sveltejs/kit'

const mkdirIfNotExistsSync = (dir: string) => {
	if (dir) {
		const dirs = dir.split('/')
		let index = 0
		let currentDir = dirs[index]
		while (index < dirs.length) {
			if (!existsSync(currentDir)) {
				mkdirSync(currentDir)
			}
			index += 1
			currentDir += `/${dirs[index]}`
		}
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json()
	const files = body.files as CustomFile[]
	const attachments = await Promise.all(
		files.map(async (file) => {
			return new Promise((resolve) => {
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
								message: err.message
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
		})
	)
	return json({ attachments })
}
