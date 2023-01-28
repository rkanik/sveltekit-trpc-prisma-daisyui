<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { useAuthStore } from '$lib/stores/useAuthStore'

	import type { PageData } from './$types'

	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import BaseDataTable from '$lib/components/base/BaseDataTable.svelte'
	import BaseActionsDropdown from '$lib/components/base/BaseActionsDropdown.svelte'

	export let data: PageData

	type Projects = typeof data.projects
	type Project = Projects[number]

	const auth = useAuthStore()

	const form = {
		update: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				projectTags: []
			} as any
		},
		create: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				projectTags: []
			},
			fields: [
				{
					name: 'name',
					type: 'text',
					label: 'Name',
					placeholder: 'Enter the name of the project'
				},
				{
					name: 'previewUrl',
					type: 'text',
					label: 'Preview URL',
					prefix: 'https://',
					placeholder: 'Live preview url of the project'
				},
				{
					name: 'sourceCodeUrl',
					type: 'text',
					label: 'Source code URL',
					prefix: 'https://',
					placeholder: 'Open source code url like github or gitlab.'
				},
				{
					name: 'description',
					type: 'textarea',
					label: 'Description',
					placeholder: 'Write project description...'
				},
				{
					name: 'projectTags',
					type: 'combobox',
					label: 'Tags',
					placeholder: 'Select tags...',
					options: () => {
						return new Promise((resolve) => {
							return trpc($page)
								.tags.list.query()
								.then((tags) => resolve(tags || []))
								.catch(() => resolve([]))
						})
					},
					combobox: {
						optionValue: 'name',
						optionText: 'name'
					}
				}
			] as any[]
		}
	}

	const headers = [
		{
			text: 'User',
			value: 'user'
		},
		{
			text: 'Project',
			value: 'project'
		},
		{
			text: 'Tags',
			value: (item: any) => {
				return (
					item.projectTags
						.map((prjectTag: any) => {
							return `#${prjectTag.tag.name}`
						})
						.join(', ') || '-'
				)
			}
		}
	]

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

	let modal = false
	let updateModal = false

	const onSubmit = async (event: CustomEvent) => {
		event.preventDefault()
		try {
			const project: Project = await trpc().projects.create.mutate({
				...event.detail,
				projectTags: event.detail.projectTags.map((tag: any) => {
					return { id: tag.id, name: tag.name }
				})
			})
			if (project) {
				modal = false
				data.projects = [project, ...data.projects]
				form.create.data = {
					name: '',
					description: '',
					previewUrl: '',
					sourceCodeUrl: '',
					projectTags: []
				}
			}
		} catch (error) {
			console.log('onSubmit', error)
		}
	}

	const onDelete = async (event: CustomEvent<Project>) => {
		if (confirm('Are you sure you want to delete?')) {
			try {
				await trpc().projects.delete.mutate({ id: event.detail.id })
				data.projects = data.projects.filter((project) => {
					return project.id !== event.detail.id
				})
			} catch (error) {
				console.log('onDelete', error)
			}
		}
	}

	const onInitUpdate = (event: CustomEvent<Project>) => {
		form.update.data = {
			...event.detail,
			projectTags: event.detail.projectTags.map((projectTag) => {
				return { name: projectTag.tag.name }
			})
		}
		updateModal = true
	}
</script>

<div>
	<div class="flex justify-between">
		<h3 class="text-xl font-bold">Projects</h3>
		<BaseModal
			bind:value={modal}
			title="Create new project"
			activator={{ class: 'btn btn-sm btn-primary', text: 'New Project' }}
		>
			<BaseForm
				bind:data={form.create.data}
				fields={form.create.fields}
				on:submit={onSubmit}
				on:cancel={() => (modal = false)}
			/>
		</BaseModal>

		<BaseModal bind:value={updateModal} activator={false} title="Update Project">
			<BaseForm
				bind:data={form.update.data}
				fields={form.create.fields}
				on:submit={onSubmit}
				on:cancel={() => (updateModal = false)}
			/>
		</BaseModal>
	</div>

	<div class="overflow-x-auto w-full mt-4">
		<BaseDataTable {headers} items={data.projects}>
			<svelte:fragment slot="actions" let:item>
				<BaseActionsDropdown
					{item}
					{actions}
					class="mx-4"
					on:delete={onDelete}
					on:update={onInitUpdate}
				/>
			</svelte:fragment>

			<svelte:fragment slot="item" let:value let:item let:header>
				{#if header.value === 'user'}
					<div class="flex items-center space-x-3">
						<div class="avatar">
							<div class="mask mask-squircle w-12 h-12">
								<img
									alt="Avatar Tailwind CSS Component"
									src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
								/>
							</div>
						</div>
						<div>
							<div class="font-bold">{item.user.name}</div>
							<div class="text-sm opacity-50">{item.user.email}</div>
						</div>
					</div>
				{:else if header.value === 'project'}
					<div class="flex items-center space-x-3">
						<div class="avatar">
							<div class="mask mask-squircle w-12 h-12">
								<img
									alt="Avatar Tailwind CSS Component"
									src="https://daisyui.com/tailwind-css-component-profile-5@56w.png"
								/>
							</div>
						</div>
						<div>
							<div class="font-bold">{item.name}</div>
							<div class="text-sm opacity-50">{item.description}</div>
						</div>
					</div>
				{:else}
					{value}
				{/if}
			</svelte:fragment>
		</BaseDataTable>
	</div>
</div>
