import { mkdirSync, existsSync } from 'fs'
export const mkdirIfNotExistsSync = (dir: string) => {
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
