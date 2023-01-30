<script lang="ts">
	import type { PageData } from './$types'

	import ProjectsPage from '$lib/components/projects/ProjectsPage.svelte'
	import MyProjectsPage from '$lib/components/projects/MyProjectsPage.svelte'

	export let data: PageData
</script>

{#if data.currentParamUser}
	{#if data.currentParamUser.id === data.currentUser?.id}
		<MyProjectsPage projects={data.projects} />
	{:else}
		<ProjectsPage projects={data.projects} />
	{/if}
{/if}
