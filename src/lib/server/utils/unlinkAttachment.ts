import { unlink } from 'fs'
import type { Attachment } from '@prisma/client'

export const unlinkAttachment = async (attachment: Attachment) => {
	return await Promise.all<{ error: boolean; message?: string }>(
		[attachment.src, attachment.large, attachment.medium, attachment.thumbnail]
			.filter(Boolean)
			.map((path) => `static${path}`)
			.map((path) => {
				return new Promise((resolve) => {
					unlink(path, (err) => {
						// console.log('unlink::', {
						// 	path,
						// 	err
						// })
						if (!err) return resolve({ error: false })
						resolve({ error: true, message: err?.message })
					})
				})
			})
	)
}
