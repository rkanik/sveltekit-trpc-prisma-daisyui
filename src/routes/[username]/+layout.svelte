<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { createCustomFile } from '$lib/utils/createCustomFile'
	import { useProjectsStore } from '$lib/stores/useProjectsStore'

	import BaseImage from '$lib/components/base/BaseImage.svelte'
	import CameraIcon from 'lucide-svelte/dist/svelte/icons/camera.svelte'
	import ProjectForm from '$lib/components/forms/ProjectForm.svelte'

	import type { LayoutData } from './$types'
	import type { AuthUserAvatar } from '$lib/$types'

	export let data: LayoutData
	const isMe = data.currentUser?.id === data.currentParamUser?.id

	// Projects
	const projectsStore = useProjectsStore()

	let files: FileList

	const onUploadAvatar = async () => {
		if (!isMe || !data.currentUser || !files.length) return

		const userId = data.currentUser.id.toString().padStart(5, '0')
		const avatar = await createCustomFile(files[0], {
			dir: `static/uploads/users/${userId}`,
			name: `USER_${userId}_AVATAR_{date}.{ext}`
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
								<ProjectForm
									on:created={projectsStore.onProjectCreated}
									on:updated={projectsStore.onProjectUpdated}
								/>
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
							<BaseImage
								alt={data.currentParamUser.name}
								src={data.currentParamUser.userAvatar?.attachment?.base64}
								lazySrc={data.currentParamUser.userAvatar?.attachment?.thumbnail}
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
										<BaseImage
											alt={data.currentParamUser.name}
											src={data.currentParamUser.userAvatar?.attachment?.base64}
											lazySrc={data.currentParamUser.userAvatar?.attachment?.thumbnail}
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
