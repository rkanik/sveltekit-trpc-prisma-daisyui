<script lang="ts">
	import type { TrpcProject, TrpcProjects } from '$lib/$types'

	import ProjectForm from '$lib/components/forms/ProjectForm.svelte'
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte'

	export let projects: TrpcProjects = []

	let modal = false
	let project: TrpcProject | undefined = undefined

	const onInitUpdate = (event: CustomEvent<TrpcProject>) => {
		modal = true
		project = event.detail
	}
</script>

<ProjectForm bind:modal {project} activator={false} />

<div class="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-5">
	{#each projects as project}
		<div class="col-span-3">
			<ProjectCard {project} on:update={onInitUpdate} />
		</div>
	{/each}
</div>
