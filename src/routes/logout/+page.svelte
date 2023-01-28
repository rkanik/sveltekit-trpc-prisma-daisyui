<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import { useAuthStore } from '$lib/stores/useAuthStore'

	import type { PageData } from './$types'

	export let data: PageData
	const auth = useAuthStore()

	$: if (data.success) {
		auth.update({
			user: undefined,
			token: undefined
		})
		invalidateAll().then(() => {
			goto('/login')
		})
	}
</script>

Logging out...
