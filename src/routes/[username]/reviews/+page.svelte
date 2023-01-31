<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

{#if data.currentParamUser}
	<h1>Reviews</h1>
{/if}
