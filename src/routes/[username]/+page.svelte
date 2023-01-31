<script lang="ts">
	import BaseJson from '$lib/components/base/BaseJson.svelte'

	import { trpc } from '$lib/trpc/client'
	import { useAuthStore } from '$lib/stores/useAuthStore'
	import { createCustomFiles } from '$lib/utils/createCustomFiles'

	import type { PageData } from './$types'
	import type { AuthUserAvatar } from '$lib/$types'
	import ProjectsPage from '$lib/components/projects/ProjectsPage.svelte'
	import { createEventDispatcher, onMount } from 'svelte'

	export let data: PageData
	const auth = useAuthStore()

	const dispatch = createEventDispatcher()
	onMount(() => {
		dispatch('projectsRef', {
			fetchProjects() {
				return data.projects
			}
		})
	})
</script>

{#if data.currentParamUser}
	<div>
		<ProjectsPage projects={data.projects} />
	</div>
{/if}
