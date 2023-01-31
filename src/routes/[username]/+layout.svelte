<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { createCustomFile } from '$lib/utils/createCustomFile'

	import CameraIcon from 'lucide-svelte/dist/svelte/icons/camera.svelte'

	import type { LayoutData } from './$types'
	import type { AuthUserAvatar } from '$lib/$types'
	import BaseModal from '$lib/components/base/BaseModal.svelte'
	import BaseForm from '$lib/components/base/BaseForm.svelte'
	import { createCustomFiles } from '$lib/utils/createCustomFiles'

	export let data: LayoutData
	const isMe = data.currentUser?.id === data.currentParamUser?.id

	let files: FileList

	const onUploadAvatar = async () => {
		if (!isMe || !data.currentUser || !files.length) return

		const userId = data.currentUser.id.toString().padStart(5, '0')
		const avatar = await createCustomFile(files[0], {
			dir: `static/uploads/users/${userId}`,
			name: `USER_${userId}_AVATAR_${Date.now()}.{ext}`
		})

		if (!avatar) {
			console.log({ avatar })
			return
		}

		const userAvatar = (await trpc().users.avatarUpdater.mutate(
			avatar
		)) as unknown as AuthUserAvatar

		if (!userAvatar) return

		data.currentUser = data.currentParamUser = {
			...data.currentUser,
			userAvatar
		}
	}

	const form = {
		update: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				projectTags: [],
				attachments: []
			} as any
		},
		create: {
			data: {
				name: '',
				description: '',
				previewUrl: '',
				sourceCodeUrl: '',
				projectTags: [],
				attachments: []
			} as any,
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
					name: 'attachments',
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
			] as any[]
		}
	}

	let modal = false

	const onSubmit = async (event: CustomEvent<typeof form.create.data>) => {
		event.preventDefault()
		try {
			const project = await trpc().projects.create.mutate({
				...event.detail,
				attachments: await createCustomFiles(event.detail.attachments, {
					dir: `static/uploads/projects/{id}`,
					name: `PROJECT_{id}_ATTACHMENT_{date}.{ext}`
				}),
				projectTags: event.detail.projectTags.map((tag: any) => {
					return { id: tag.id, name: tag.name }
				})
			})
			if (project) {
				modal = false
				// projects = [project, ...projects]
				form.create.data = {
					name: '',
					description: '',
					previewUrl: '',
					sourceCodeUrl: '',
					projectTags: [],
					attachments: []
				}
			}
		} catch (error) {
			console.log('onSubmit', error)
		}
	}

	const onProjectsRef = (e: CustomEvent) => {
		console.log('onProjectsRef', e.detail)
	}
</script>

{#if data.currentParamUser}
	<div class="bg-base-300">
		<div class="drawer drawer-mobile">
			<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex flex-col">
				<div class="px-4">
					<div class="mt-4">
						<div class="carousel w-full rounded-2xl overflow-hidden">
							<div id="slide1" class="carousel-item relative w-full">
								<img
									src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
									class="w-full"
								/>
								<div
									class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
								>
									<a href="#slide4" class="btn btn-circle">❮</a>
									<a href="#slide2" class="btn btn-circle">❯</a>
								</div>
							</div>
							<div id="slide2" class="carousel-item relative w-full">
								<img
									src="https://daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg"
									class="w-full"
								/>
								<div
									class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
								>
									<a href="#slide1" class="btn btn-circle">❮</a>
									<a href="#slide3" class="btn btn-circle">❯</a>
								</div>
							</div>
							<div id="slide3" class="carousel-item relative w-full">
								<img
									src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg"
									class="w-full"
								/>
								<div
									class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
								>
									<a href="#slide2" class="btn btn-circle">❮</a>
									<a href="#slide4" class="btn btn-circle">❯</a>
								</div>
							</div>
							<div id="slide4" class="carousel-item relative w-full">
								<img
									src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg"
									class="w-full"
								/>
								<div
									class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
								>
									<a href="#slide3" class="btn btn-circle">❮</a>
									<a href="#slide1" class="btn btn-circle">❯</a>
								</div>
							</div>
						</div>

						<div class="tabs tabs-boxed mt-4">
							<a
								class="tab tab-lg"
								class:tab-active={$page.url.pathname ===
									`/${data.currentParamUser.username}`}
								href="/{data.currentParamUser.username}"
							>
								Projects
							</a>
							<a
								class="tab tab-lg"
								href="/{data.currentParamUser.username}/blogs"
								class:tab-active={$page.url.pathname ===
									`/${data.currentParamUser.username}/blogs`}>Blogs</a
							>
							<a
								class="tab tab-lg"
								href="/{data.currentParamUser.username}/reviews"
								class:tab-active={$page.url.pathname ===
									`/${data.currentParamUser.username}/reviews`}>Reviews</a
							>

							<div class="ml-auto">
								<BaseModal
									bind:value={modal}
									title="Create new project"
									activator={{ class: 'btn btn-primary', text: 'New Project' }}
								>
									<BaseForm
										bind:data={form.create.data}
										fields={form.create.fields}
										on:submit={onSubmit}
										on:cancel={() => (modal = false)}
									/>
								</BaseModal>
							</div>
						</div>

						<div class="mt-4">
							<slot />
						</div>
					</div>
				</div>
			</div>
			<div class="drawer-side py-4 pl-4">
				<label for="my-drawer-3" class="drawer-overlay" />
				<ul class="menu w-96">
					<div class="card card-compact bg-base-100 shadow-xl">
						<figure class="h-64 relative group">
							<img
								alt="Shoes"
								src={data.currentParamUser.userAvatar?.attachment.src ||
									'/img/placeholder.svg'}
							/>

							{#if isMe}
								<div
									class="absolute w-12 h-12 right-1 bottom-1 !grid place-items-center bg-black bg-opacity-60 rounded-full transition-all duration-300 transform scale-0 group-hover:scale-100"
								>
									<input
										bind:files
										type="file"
										accept="image/*"
										class="absolute inset-0 z-10 opacity-0 cursor-pointer"
										on:change={onUploadAvatar}
									/>
									<CameraIcon size={22} color="white" />
								</div>
							{/if}
						</figure>

						<div class="card-body">
							<div class="flex space-x-5">
								<!-- Avatar -->
								<div class="avatar -mt-12 relative group">
									<div
										class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
									>
										<img
											alt="User avatar"
											src={data.currentParamUser.userAvatar?.attachment.src ||
												'/img/placeholder.svg'}
										/>
									</div>

									{#if isMe}
										<div
											class="absolute inset-0 !grid place-items-center bg-black bg-opacity-60 rounded-full transition-all duration-300 transform scale-0 group-hover:scale-100"
										>
											<input
												bind:files
												type="file"
												accept="image/*"
												class="absolute inset-0 z-10 opacity-0 cursor-pointer"
												on:change={onUploadAvatar}
											/>
											<CameraIcon color="white" />
										</div>
									{/if}
								</div>
								<div class="-mt-2">
									<h2 class="card-title !mb-0">
										<span>{data.currentParamUser.name}</span>
										<span class="text-base">
											(<a href="/{data.currentParamUser.username}" class="text-accent">
												@{data.currentParamUser.username}
											</a>)
										</span>
									</h2>
									<p>{data.currentParamUser.email}</p>
								</div>
							</div>

							<div class="divider" />

							<p>If a dog chews shoes whose shoes does he choose?</p>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam, maiores
								obcaecati reiciendis recusandae ea esse ipsa aspernatur minima quam totam
								sunt. Ab quaerat numquam exercitationem, molestiae sed incidunt iste autem?
							</p>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam, maiores
								obcaecati reiciendis recusandae ea esse ipsa aspernatur minima quam totam
								sunt. Ab quaerat numquam exercitationem, molestiae sed incidunt iste autem?
							</p>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</div>
{/if}
