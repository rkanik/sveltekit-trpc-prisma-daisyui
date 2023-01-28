<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto, invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import type { ActionData } from './$types'

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
	<article>
		<header>Signup</header>

		<label>
			Name
			<input name="name" type="name" required bind:this={nameInput} />
		</label>

		<label>
			Email
			<input name="email" type="email" required bind:this={emailInput} />
		</label>

		<label>
			Password
			<input name="password" type="password" required bind:this={passwordInput} />
		</label>

		<label>
			Password
			<input
				name="passwordConfirmation"
				type="password"
				required
				bind:this={passwordConfirmationInput}
			/>
		</label>

		<footer>
			{#if returnTo}
				<a role="button" class="secondary" href={returnTo}>Cancel</a>
			{/if}
			<button type="submit">Signup</button>
		</footer>
	</article>
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
