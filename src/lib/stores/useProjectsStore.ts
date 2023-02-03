import { writable, type Updater } from 'svelte/store'
import type { TrpcProject, TrpcProjects } from '$lib/$types'

export type ProjectsStore = ReturnType<typeof useProjectsStore>
export type ProjectsState = {
	projects: TrpcProjects
}

const store = writable<ProjectsState>({
	projects: []
})

export const useProjectsStore = () => {
	const update = (data: ProjectsState | Updater<ProjectsState>) => {
		if (typeof data === 'function') {
			store.update(data)
			return
		}
		store.update(($state) => {
			Object.entries(data).forEach(([key, value]) => {
				;($state as any)[key] = value
			})
			return $state
		})
	}

	const updateKeep = (data: ProjectsState) => {
		store.update(($state) => {
			Object.entries(data).forEach(([key, value]) => {
				;($state as any)[key] = value || ($state as any)[key]
			})
			return $state
		})
	}

	const onProjectCreated = (event: CustomEvent<TrpcProject>) => {
		store.update(($state) => {
			return {
				...$state,
				projects: [event.detail, ...$state.projects]
			}
		})
	}

	const onProjectUpdated = (event: CustomEvent<TrpcProject>) => {
		store.update(($state) => {
			return {
				...$state,
				projects: $state.projects.map((project) => {
					return project.id === event.detail.id ? event.detail : project
				})
			}
		})
	}

	return {
		update,
		updateKeep,
		set: store.set,
		subscribe: store.subscribe,
		onProjectCreated,
		onProjectUpdated
	}
}
