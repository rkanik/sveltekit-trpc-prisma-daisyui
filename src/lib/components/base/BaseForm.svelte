<script lang="ts">
	import cn from 'classnames'
	import { createEventDispatcher } from 'svelte'
	import BaseCombobox from './BaseCombobox.svelte'

	type Option = {
		name: string
		value: string | number
	}

	type Field = {
		name: string
		type?: 'text' | 'textarea' | 'combobox'
		label?: string
		class?: string
		placeholder?: string
		options?: Option[]
		prefix?: string
		suffix?: string
		combobox?: any
	}

	export let data: any = {}
	export let fields: Field[] = []
	export let isLoading: boolean = false

	const dispatch = createEventDispatcher()

	const onSubmit = (e: any) => {
		console.log('onSubmit', e)
		e.preventDefault()
		dispatch('submit', data)
	}
</script>

<form on:submit|preventDefault class="grid grid-cols-12 gap-4">
	{#each fields as field}
		<div class={field.class || 'col-span-12'}>
			{#if field.type === 'text'}
				<div class="form-control">
					{#if field.label}
						<label for="" class="label">
							<span class="label-text">{field.label}</span>
						</label>
					{/if}
					<label class={cn({ 'input-group': field.prefix || field.suffix })}>
						{#if field.prefix}
							<span>{field.prefix}</span>
						{/if}
						<input
							bind:value={data[field.name]}
							type="text"
							placeholder={field.placeholder || 'Type here...'}
							class="input input-bordered w-full"
						/>
						{#if field.suffix}
							<span>{field.suffix}</span>
						{/if}
					</label>
				</div>
			{:else if field.type === 'textarea'}
				<textarea
					bind:value={data[field.name]}
					class="textarea textarea-bordered w-full"
					placeholder={field.placeholder || 'Type here...'}
				/>
			{:else if field.type === 'combobox'}
				<BaseCombobox
					{...field.combobox || {}}
					bind:value={data[field.name]}
					returnObject
					options={field.options || []}
					placeholder={field.placeholder}
				/>
			{/if}
		</div>
	{/each}

	<div class="col-span-12 flex items-center justify-end space-x-4">
		<button type="button" class="btn">Cancel</button>
		<button
			type="button"
			class="btn btn-primary {cn({ loading: isLoading })}"
			on:click={onSubmit}
		>
			Submit
		</button>
	</div>
</form>
