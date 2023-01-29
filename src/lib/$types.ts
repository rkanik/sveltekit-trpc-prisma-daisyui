export type CustomFile = {
	ext: string
	name: string
	type: string
	size: number
	base64: string
	encoding: 'base64'
	lastModified: number
	upload: {
		dir: string
		name: string
	}
}
