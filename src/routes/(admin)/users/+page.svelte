<script lang="ts">
	import type { PageData } from './$types'

	import { dayjs } from '$lib/dayjs'
	import { goto } from '$app/navigation'

	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'

	export let data: PageData

	const actions = [
		{
			text: 'View',
			event: 'view'
		},
		{
			text: 'Update',
			event: 'update'
		},
		{
			text: 'Delete',
			event: 'delete'
		}
	]
</script>

<div>
	<BaseDataTable
		items={data.users}
		headers={[
			{ text: 'ID', value: 'id' },
			{ text: 'Avatar', value: 'avatar' },
			{ text: 'Name', value: 'name' },
			{ text: 'Username', value: 'username' },
			{ text: 'Email', value: 'email' },
			{ text: 'Created', value: (item) => dayjs(item.createdAt).fromNow() },
			{ text: 'Updated', value: (item) => dayjs(item.updatedAt).fromNow() }
		]}
	>
		<svelte:fragment slot="actions" let:item>
			<BaseActionsDropdown
				{item}
				{actions}
				class="mx-4"
				on:view={() => goto(`/${item.username}`)}
			/>
		</svelte:fragment>
		<svelte:fragment slot="item" let:value let:item let:header>
			{#if header.value === 'avatar'}
				<div class="mask mask-squircle w-12 h-12">
					<img
						alt={item.name}
						src={item.userAvatar?.attachment.src || '/img/placeholder.svg'}
					/>
				</div>
			{:else}
				{value}
			{/if}
		</svelte:fragment>
	</BaseDataTable>
</div>
