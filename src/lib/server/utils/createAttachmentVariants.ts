import sharp from 'sharp'
import { unlinkSync } from 'fs'
import { prisma } from '$lib/server/prisma'
import type { Attachment } from '@prisma/client'

export const createAttachmentVariants = async (attachment: Attachment) => {
	return new Promise<Attachment>((resolve) => {
		//
		const extensionWithDot = '.' + attachment.src.split('.').pop()

		const path = `static${attachment.src}`
		const pathWithoutExtension = path.replace(extensionWithDot, '')
		const pathPublicWithoutExtension = attachment.src.split('.').slice(0, -1).join('.')

		const onErrorMetaData = () => resolve(attachment)
		const onErrorLarge = () => {
			attachment.large = attachment.src
		}
		const onErrorMedium = () => {
			attachment.medium = attachment.large || attachment.src
		}
		const onErrorThumbnail = () => {
			attachment.thumbnail = attachment.medium || attachment.large || attachment.src
		}

		const onMetaData = async (metadata: sharp.Metadata) => {
			if (!metadata.width) return onErrorMetaData()

			let converted = await sharp(path)
				.resize({ width: [1600, metadata.width].sort((a, b) => b - a).pop() })
				.webp({ quality: 80 })
				.toFile(pathWithoutExtension + '.webp')
				.catch((err) => {
					//
					console.log({ err1600: err })
				})

			if (converted) attachment.src = pathPublicWithoutExtension + '.webp'

			if (metadata.width > 1200) {
				converted = await sharp(path)
					.resize({ width: 1200 })
					.webp({ quality: 80 })
					.toFile(pathWithoutExtension + '_1200.webp')
					.catch(onErrorLarge)
				if (converted) attachment.large = pathPublicWithoutExtension + '_1200.webp'
				else onErrorLarge()
			} else onErrorLarge()

			if (metadata.width > 800) {
				converted = await sharp(path)
					.resize({ width: 800 })
					.webp({ quality: 80 })
					.toFile(pathWithoutExtension + '_800.webp')
					.catch(onErrorMedium)
				if (converted) attachment.medium = pathPublicWithoutExtension + '_800.webp'
				else onErrorMedium()
			} else onErrorMedium()

			if (metadata.width > 400) {
				converted = await sharp(path)
					.resize({ width: 400 })
					.webp({ quality: 80 })
					.toFile(pathWithoutExtension + '_400.webp')
					.catch(onErrorThumbnail)
				if (converted) attachment.thumbnail = pathPublicWithoutExtension + '_400.webp'
				else onErrorThumbnail()
			} else onErrorThumbnail()

			const res4 = await sharp(path)
				.resize({ width: 3 })
				.webp({ quality: 100 })
				.toBuffer()
				.catch(() => {
					//
				})

			if (res4) attachment.base64 = `data:image/webp;base64,${res4.toString('base64')}`
			if (attachment.src.endsWith('.webp')) {
				try {
					unlinkSync(path)
				} catch (_) {
					//
				}
			}

			const updatedAttachment = await prisma.attachment.update({
				where: { id: attachment.id },
				data: {
					src: attachment.src,
					large: attachment.large,
					medium: attachment.medium,
					thumbnail: attachment.thumbnail,
					base64: attachment.base64
				}
			})

			resolve(updatedAttachment)
		}

		sharp(path).metadata().then(onMetaData).catch(onErrorMetaData)
	})
}
