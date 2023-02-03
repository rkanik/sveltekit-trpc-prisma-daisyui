<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { createEventDispatcher } from 'svelte'
	import { createCustomFiles } from '$lib/utils/createCustomFiles'

	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import BaseModal from '$lib/components/base/BaseModal.svelte'

	import type { BaseField, TrpcCreateProject, TrpcProject } from '$lib/$types'
	type FormProject = Pick<
		TrpcCreateProject,
		'name' | 'description' | 'projectTags' | 'projectAttachments' | 'previewUrl' | 'sourceCodeUrl'
	> & {
		newAttachments: File[]
	}

	const dispatch = createEventDispatcher()
	const newFormProject = (v?: TrpcProject): FormProject => {
		return {
			name: v?.name || '',
			description: v?.description || '',
			previewUrl: v?.previewUrl || undefined,
			sourceCodeUrl: v?.sourceCodeUrl || undefined,
			projectTags: (v?.projectTags || []).map((projectTag) => ({
				name: projectTag.tag.name
			})),
			projectAttachments: v?.projectAttachments || [],
			newAttachments: []
		}
	}

	export let modal = false
	export let activator = true
	export let project: TrpcProject | undefined = undefined

	let innerProject: FormProject = newFormProject()
	let isUpdate = false
	$: if (project) {
		isUpdate = true
		innerProject = newFormProject(project)
	}

	const fields: BaseField[] = [
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
			name: 'newAttachments',
			type: 'file',
			multiple: true,
			accept: 'image/*',
			label: 'Attachments',
			placeholder: 'Choose attachments'
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
	]

	const onSubmit = async (event: CustomEvent<FormProject>) => {
		event.preventDefault()
		try {
			const project = await trpc().projects.create.mutate({
				...event.detail,
				projectTags: (event.detail.projectTags || []).map((tag) => {
					return { id: tag.id, name: tag.name }
				}),
				newAttachments: await createCustomFiles(event.detail.newAttachments, {
					dir: `static/uploads/projects/{id}`,
					name: `PROJECT_{id}_ATTACHMENT_{date}.{ext}`
				})
			})
			if (project) {
				modal = false
				innerProject = newFormProject()
				dispatch(isUpdate ? 'updated' : 'created', project)
			}
		} catch (error) {
			console.log('onSubmit', error)
		}
	}
</script>

<BaseModal
	bind:value={modal}
	title="Create new project"
	activator={activator ? { class: 'btn btn-primary', text: 'New Project' } : activator}
>
	<BaseForm
		{fields}
		bind:data={innerProject}
		on:submit={onSubmit}
		on:cancel={() => (modal = false)}
	/>
</BaseModal>
