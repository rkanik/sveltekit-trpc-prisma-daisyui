<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	export let to = 'body'

	let el: HTMLDivElement
	let toEl: HTMLElement
	let slots: Element[] = []

	onMount(() => {
		toEl = document.querySelector(to) || document.body

		slots = Array.from(el.children)
		slots.forEach((child) => toEl?.appendChild(child))

		el?.remove()
	})

	onDestroy(() => {
		slots.forEach((child) => child.remove())
	})
</script>

<div class="hidden" bind:this={el}>
	<slot />
</div>
