<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'

	import { trpc } from '$lib/trpc/client'
	import { useAuthStore } from '$lib/stores/useAuthStore'
	import { createCustomFiles } from '$lib/utils/createCustomFiles'

	import type { AuthUserAvatar } from '$lib/$types'

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

{#if $auth.user}
	<div class="avatar">
		<div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
			<img src={$auth.user.userAvatar.attachment.src} />
		</div>
	</div>

	<input bind:files multiple type="file" accept="image/*" class="file-input w-full max-w-xs" />
	<button class="btn btn-primary" on:click={() => onUploadAvatar(files)}>Upload</button>

	<BaseJson data={$auth.user} />
{/if}
