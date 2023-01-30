<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'

	import { trpc } from '$lib/trpc/client'
	import { useAuthStore } from '$lib/stores/useAuthStore'
	import { createCustomFiles } from '$lib/utils/createCustomFiles'

	import type { PageData } from './$types'
	import type { AuthUserAvatar } from '$lib/$types'

	export let data: PageData
	const auth = useAuthStore()

	let files: FileList

	const onUploadAvatar = async (files: FileList) => {
		if (!$auth.user || !files.length) return

		const userId = $auth.user.id.toString().padStart(5, '0')
		const [avatar] = await createCustomFiles(files, {
			dir: `static/uploads/users/${userId}`,
			name: `USER_${userId}_AVATAR_${Date.now()}.{ext}`
		})

		console.log({ avatar })

		const updatedAvatar = (await trpc().users.avatarUpdater.mutate(
			avatar
		)) as unknown as AuthUserAvatar

		console.log('auth.update', {
			user: {
				...$auth.user,
				userAvatar: updatedAvatar
			}
		})
		auth.update({
			user: {
				...$auth.user,
				userAvatar: updatedAvatar
			}
		})
		console.log({ updatedAvatar })
	}
</script>

{#if data.user}
	<div class="avatar">
		<div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
			<img
				alt="User avatar"
				src={data.user.userAvatar?.attachment.src || '/img/placeholder.svg'}
			/>
		</div>
	</div>

	{#if $auth.user?.id === data.user.id}
		<input bind:files multiple type="file" accept="image/*" class="file-input w-full max-w-xs" />
		<button class="btn btn-primary" on:click={() => onUploadAvatar(files)}>Upload</button>
	{/if}

	<BaseJson data={data.user} />
{/if}
