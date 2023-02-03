<script lang="ts">
	import '$lib/assets/css/tailwind.css'

	import { useAuthStore } from '$lib/stores/useAuthStore'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	const auth = useAuthStore()
	auth.updateKeep({
		token: data.token,
		user: data.currentUser
	})
</script>

<div class="bg-base-300">
	<slot />
</div>
