<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import BaseDropdown from './BaseDropdown.svelte'
	import MoreVertical from 'lucide-svelte/dist/svelte/icons/more-vertical.svelte'

	type Action = {
		text: string
		event: string
	}

	export let item: any
	export let actions: Action[] = [
		{
			text: 'Delete',
			event: 'delete'
		}
	]

	const dispatch = createEventDispatcher()
	const onClick = (action: Action) => {
		return () => dispatch(action.event, item)
	}
</script>

<BaseDropdown {...$$props}>
	<button slot="activator" class="btn btn-sm btn-square">
		<MoreVertical size="18" />
	</button>
	<ul class="menu p-2 shadow bg-base-200 rounded-box w-52">
		{#each actions as action}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<li><a href="#" on:click={onClick(action)}>{action.text}</a></li>
		{/each}
	</ul>
</BaseDropdown>
