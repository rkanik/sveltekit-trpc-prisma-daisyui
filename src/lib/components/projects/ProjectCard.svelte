<script lang="ts">
	import { dayjs } from '$lib/dayjs'
	import { createEventDispatcher } from 'svelte'
	import { useAuthStore } from '$lib/stores/useAuthStore'

	import PencilIcon from 'lucide-svelte/dist/svelte/icons/pencil.svelte'

	import type { TrpcProject } from '$lib/$types'

	export let project: TrpcProject

	const auth = useAuthStore()

	const dispatch = createEventDispatcher()
	const onClickUpdate = () => {
		dispatch('update', project)
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<figure>
		{#if project.projectAttachments.length > 0}
			<img
				alt={project.projectAttachments[0].attachment.name}
				src={project.projectAttachments[0].attachment.src}
				class="h-52 w-full !object-cover !object-center"
			/>
		{:else}
			<img
				alt="placeholder"
				src="/img/placeholder.svg"
				class="h-52 w-full !object-cover !object-center"
			/>
		{/if}
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{project.name}
			{#if project.userId === $auth.user?.id}
				<button class="btn btn-sm btn-circle" on:click={onClickUpdate}>
					<PencilIcon size={15} />
				</button>
			{/if}
			{#if dayjs().diff(dayjs(project.createdAt), 'hour') > 24}
				<div class="badge badge-secondary">NEW</div>
			{/if}
		</h2>
		<p>{project.description}</p>
		<div class="card-actions justify-end mt-4">
			{#each project.projectTags as protectTag}
				<div class="badge badge-outline">{protectTag.tag.name}</div>
			{/each}
		</div>
		<!-- <div>{dayjs(project.createdAt).fromNow()}</div> -->
	</div>
</div>
