<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	export let src: string | null | undefined = ''
	export let lazySrc: string | null | undefined = src
	export let alt = src || lazySrc

	export let errorSrc = '/img/placeholder.svg'

	let isMounted = false
	let imgRef: HTMLImageElement
	let obserber: IntersectionObserver

	const onError = () => (imgRef.src = errorSrc)

	// $: if (src && isMounted) {
	// 	// console.log({ srcChange: src })
	// 	obserber.observe(imgRef)
	// }

	onMount(() => {
		isMounted = true
		obserber = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const lazySrc = entry.target.getAttribute('data-src')
					if (lazySrc) {
						entry.target.setAttribute('src', lazySrc)
						obserber.unobserve(imgRef)
					}
				}
			})
		})
		obserber.observe(imgRef)
	})

	onDestroy(() => {
		obserber?.unobserve(imgRef)
	})
</script>

<img
	{alt}
	{src}
	data-src={lazySrc}
	bind:this={imgRef}
	on:error={onError}
	class="object-contain content-center w-full"
/>
