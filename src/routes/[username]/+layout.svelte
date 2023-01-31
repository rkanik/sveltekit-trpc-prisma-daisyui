<script lang="ts">
	import type { LayoutData } from './$types'
	export let data: LayoutData
</script>

<div class="bg-base-300">
	<div class="drawer drawer-mobile">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<div class="px-2 pt-2">
				<ul class="w-full rounded-md p-1 menu menu-compact menu-horizontal bg-base-100">
					<li>
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="/">App</a>
					</li>
					<li>
						<a href="/">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/></svg
							>
						</a>
					</li>

					<li class="ml-auto">
						<a href="/dasd">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
						</a>
					</li>
					<li>
						<a href="/dfgdfg">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/></svg
							>
						</a>
					</li>

					{#if data.currentUser}
						<li>
							<a href="/{data.currentUser.username}">Profile</a>
						</li>
						<li>
							<a href="/logout">Logout</a>
						</li>
					{:else}
						<li>
							<a href="/login">Login</a>
						</li>
					{/if}
				</ul>
			</div>

			<div class="px-4 lg:px-5">
				<!-- Page content here -->
				<div class="mt-4 lg:mt-5">
					<slot />
				</div>
			</div>
		</div>
		<div class="drawer-side">
			<label for="my-drawer-3" class="drawer-overlay" />
			<ul class="menu p-4 w-80 bg-base-100">
				<!-- Sidebar content here -->
				<li><a href="/users">Users</a></li>
				{#if data.currentUser}
					<li><a href="/{data.currentUser.username}/projects">Projects</a></li>
				{/if}
			</ul>
		</div>
	</div>
</div>
