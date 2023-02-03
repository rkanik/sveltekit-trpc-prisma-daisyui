<script lang="ts">
	// import { page } from '$app/stores'
	// import { trpc } from '$lib/trpc/client'
	import { useProjectsStore } from '$lib/stores/useProjectsStore'

	import type { PageData } from './$types'

	import ProjectsPage from '$lib/components/projects/ProjectsPage.svelte'

	export let data: PageData

	const store = useProjectsStore()
	store.update({ projects: data.projects })

	// const onFetchProjects = async () => {
	// 	data.projects = await trpc($page).projects.list.query({
	// 		where: { userId: data.currentParamUser?.id }
	// 	})
	// 	return data.projects
	// }
</script>

{#if data.currentParamUser}
	<div>
		<ProjectsPage projects={$store.projects} />
	</div>
{/if}
