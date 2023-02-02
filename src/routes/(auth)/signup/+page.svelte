<script lang="ts">
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import { goto, invalidateAll } from '$app/navigation'

	import type { ActionData } from './$types'

	import UserIcon from 'lucide-svelte/dist/svelte/icons/user.svelte'
	import MailIcon from 'lucide-svelte/dist/svelte/icons/mail.svelte'
	import LockIcon from 'lucide-svelte/dist/svelte/icons/lock.svelte'

	export let form: ActionData

	let error = false

	let nameInput: HTMLInputElement
	let emailInput: HTMLInputElement
	let passwordInput: HTMLInputElement
	let passwordConfirmationInput: HTMLInputElement

	$: returnTo = $page.url.searchParams.get('returnTo')

	$: (async () => {
		if (form?.success) {
			await invalidateAll()
			await goto(returnTo || '/users')
		} else if (form?.error) {
			error = true
		}
	})()

	const clearError = () => {
		error = false
	}
</script>

<svelte:head>
	<title>Login • Bookstall</title>
</svelte:head>

<form method="POST" use:enhance>
	<header>
		<h1 class="text-xl font-medium">Signup</h1>
		<a href="/login" class="text-secondary text-sm">Already have an account?</a>
	</header>

	<div class="form-control mt-4 xl:mt-8">
		<label for="account" class="label">
			<span class="label-text">Name</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<UserIcon />
			</span>
			<input
				required
				type="text"
				name="name"
				placeholder="Full name"
				class="input input-bordered border-l-0"
				bind:this={nameInput}
			/>
		</label>
	</div>

	<div class="form-control">
		<label for="account" class="label">
			<span class="label-text">Email</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<MailIcon />
			</span>
			<input
				required
				type="email"
				name="email"
				placeholder="Enter email address"
				class="input input-bordered border-l-0"
				bind:this={emailInput}
			/>
		</label>
	</div>

	<div class="form-control">
		<label for="account" class="label">
			<span class="label-text">Password</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<LockIcon />
			</span>
			<input
				required
				type="password"
				name="password"
				placeholder="********"
				class="input input-bordered border-l-0"
				bind:this={passwordInput}
			/>
		</label>
	</div>

	<div class="form-control">
		<label for="account" class="label">
			<span class="label-text">Confirm Password</span>
		</label>
		<label class="input-group">
			<span class="border border-base-100 border-r-0">
				<LockIcon />
			</span>
			<input
				required
				type="password"
				placeholder="********"
				name="passwordConfirmation"
				class="input input-bordered border-l-0"
				bind:this={passwordConfirmationInput}
			/>
		</label>
	</div>

	<footer class="mt-5">
		<div class="flex space-x-4">
			{#if returnTo}
				<a role="button" class="secondary" href={returnTo}>Cancel</a>
			{/if}
			<button type="submit" class="btn btn-outline btn-success flex-1">Signup</button>
		</div>
		<div class="mt-2 flex justify-between">
			<a href="/" class="text-secondary text-sm">Home</a>
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
