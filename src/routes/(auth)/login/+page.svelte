<script lang="ts">
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import { goto, invalidateAll } from '$app/navigation'
	import { useAuthStore } from '$lib/stores/useAuthStore'

	import type { ActionData } from './$types'

	import UserIcon from 'lucide-svelte/dist/svelte/icons/user.svelte'
	import LockIcon from 'lucide-svelte/dist/svelte/icons/lock.svelte'

	export let form: ActionData

	let error = false
	let emailInput: HTMLInputElement
	let passwordInput: HTMLInputElement

	$: returnTo = $page.url.searchParams.get('returnTo')
	$: (async () => {
		if (form?.success) {
			console.log({ form })

			await invalidateAll()
			await goto(returnTo || '/')
		} else if (form?.error) {
			error = true
		}
	})()

	const auth = useAuthStore()
	$: if (form?.user || form?.token) {
		console.log('auth.update')
		auth.updateKeep({
			user: form?.user,
			token: form?.token
		})
	}

	const autofill = (user: 'john' | 'jane') => () => {
		emailInput.value = `${user}@mail.com`
		passwordInput.value = user === 'john' ? '1234' : 'qwer'
	}

	const clearError = () => {
		error = false
	}
</script>

<svelte:head>
	<title>Login • Bookstall</title>
</svelte:head>

<form method="POST" use:enhance>
	<header>
		<h1 class="text-xl font-medium">Login</h1>
		<a href="/signup" class="text-secondary text-sm">Don't have an account?</a>
	</header>

	<div class="form-control mt-4 xl:mt-8">
		<label for="account" class="label">
			<span class="label-text">Account</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<UserIcon />
			</span>
			<input
				required
				type="text"
				name="email"
				placeholder="Email or username"
				class="input input-bordered border-l-0"
				bind:this={emailInput}
			/>
		</label>
	</div>

	<div class="form-control mt-2">
		<label for="account" class="label">
			<span class="label-text">Password</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<LockIcon />
			</span>
			<input
				required
				name="password"
				type="password"
				placeholder="********"
				class="input input-bordered border-l-0"
				bind:this={passwordInput}
			/>
		</label>
	</div>

	<footer class="mt-5">
		<div class="flex space-x-4">
			{#if returnTo}
				<a role="button" class="secondary" href={returnTo}>Cancel</a>
			{/if}
			<button type="submit" class="btn btn-outline btn-success flex-1">Login</button>
		</div>
		<div class="mt-2 flex justify-between">
			<a href="/" class="text-secondary text-sm">Home</a>
			<a href="/forgot-password" class="text-secondary text-sm">Forgot password?</a>
		</div>
	</footer>
</form>

<dialog open={!!error}>
	<article>
		<header>Authentication failed!</header>
		<p>Please check your credentials and try again.</p>
		<footer>
			<button class="secondary" on:click={clearError}>Ok</button>
		</footer>
	</article>
</dialog>

<style>
	form {
		max-width: 500px;
		margin: var(--block-spacing-vertical) auto;
	}
</style>
