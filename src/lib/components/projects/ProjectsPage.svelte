<script lang="ts">
	import type { TrpcProjects } from '$lib/$types'

	import ProjectCard from '$lib/components/projects/ProjectCard.svelte'

	export let projects: TrpcProjects = []
</script>

{#if true}
	<div class="grid grid-cols-12 gap-5">
		{#each projects as project}
			<div class="col-span-3">
				<ProjectCard {project} />
			</div>
		{/each}
	</div>
{/if}
