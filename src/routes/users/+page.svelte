<script lang="ts">
	import type { PageData } from './$types'
	import type { CustomFile } from '$lib/$types'

	export let data: PageData

	let files: FileList

	const onUploadAttachments = async (event: FileList) => {
		const files = (
			await Promise.all<{
				error: boolean
				message?: string
				data?: CustomFile
			}>(
				Array.from(event).map(async (file) => {
					return new Promise((resolve) => {
						const reader = new FileReader()
						reader.onloadend = async () => {
							if (reader.result) {
								const user = { id: 2 }
								const ext = file.name.split('.').pop() || ''
								const userId = user.id.toString().padStart(5, '0')
								return resolve({
									error: false,
									data: {
										ext,
										name: file.name,
										type: file.type,
										size: file.size,
										encoding: 'base64',
										base64: reader.result as string,
										lastModified: file.lastModified,
										upload: {
											dir: `static/uploads/users/${userId}`,
											name: `USER_${userId}_AVATAR_${Date.now()}.${ext}`
										}
									}
								})
							}
							return resolve({
								error: true,
								message: 'File read result is null'
							})
						}
						reader.onerror = () => {
							return resolve({
								error: true,
								message: 'Error while reading file'
							})
						}
						reader.readAsDataURL(file)
					})
				})
			)
		)
			.filter((res: any) => !res.error)
			.map((res: any) => res.data)

		const res = await fetch('/api/attachments', {
			method: 'POST',
			body: JSON.stringify({ files })
		}).then((res) => res.json())

		console.log({
			attachments: res?.attachments
		})
	}
</script>

<div>
	<div>users</div>

	<input bind:files multiple type="file" accept="image/*" class="file-input w-full max-w-xs" />
	<button class="btn btn-primary" on:click={() => onUploadAttachments(files)}>Upload</button>

	<!-- The button to open modal -->
	<label for="my-modal-3" class="btn">open modal</label>

	<!-- Put this part before </body> tag -->
	<input type="checkbox" id="my-modal-3" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box relative">
			<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
			<p class="py-4">
				You've been selected for a chance to get one year of subscription to use Wikipedia for
				free!
			</p>
		</div>
	</div>

	<pre><code>{JSON.stringify(data.users, null, 2)}</code></pre>
</div>
