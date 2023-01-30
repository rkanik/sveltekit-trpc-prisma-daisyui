<script lang="ts">
	import type { TrpcProject } from '$lib/$types'
	export let project: TrpcProject
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
			<!-- <div class="badge badge-secondary">NEW</div> -->
		</h2>
		<p>{project.description}</p>
		<div class="card-actions justify-end mt-4">
			{#each project.projectTags as protectTag}
				<div class="badge badge-outline">{protectTag.tag.name}</div>
			{/each}
		</div>
	</div>
</div>
