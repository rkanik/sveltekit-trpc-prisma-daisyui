<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import cn from 'classnames'
	export let id = ''

	export let optionText = 'text'
	export let optionValue = 'value'
	export let returnObject = false
	export let value: any[] = []
	export let readonly = false
	export let placeholder = ''
	export let options: any[] = []

	let input: any,
		inputValue: any,
		activeOption: any,
		showOptions = false,
		selected: any = {},
		first = true,
		slot: any,
		filtered: any[] = []

	let el: HTMLDivElement
	let optionsEl: HTMLDivElement

	const iconClearPath =
		'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

	onMount(() => {
		// slot.querySelectorAll('option').forEach((o) => {
		// 	o.selected && !value.includes(o.value) && (value = [...value, o.value])
		// 	options = [...options, { value: o.value, name: o.textContent }]
		// })
		first = false
		if (value) {
			selected = options.reduce((selected, option) => {
				return value.includes(option.value) ? { ...selected, [option.value]: option } : selected
			}, {})
		}
	})

	$: if (el && optionsEl && showOptions) {
		const rect = el.getBoundingClientRect()
		// console.log(rect, optionsEl)
		// top:${rect.top}px;
		// left:${rect.left}px;
		optionsEl.style.cssText = `
			width:${rect.width}px;
		`
	}

	$: if (!first) {
		value = returnObject
			? Object.values(selected)
			: Object.values(selected).map((option) => {
					return option[optionValue]
			  })
	}

	$: {
		filtered = inputValue
			? options.filter((option) => {
					return option[optionText].toLowerCase().includes(inputValue.toLowerCase())
			  })
			: options
	}

	$: if ((activeOption && !filtered.includes(activeOption)) || (!activeOption && inputValue)) {
		activeOption = filtered[0]
	}

	function add(option: any) {
		if (!readonly) {
			selected[option[optionValue]] = option
		}
	}

	function remove(optionValue: any) {
		if (!readonly) {
			const { [optionValue]: val, ...rest } = selected
			selected = rest
		}
	}

	function optionsVisibility(show: any) {
		if (readonly) return
		if (typeof show === 'boolean') {
			showOptions = show
			show && input.focus()
		} else {
			showOptions = !showOptions
		}
		if (!showOptions) {
			activeOption = undefined
		}
	}

	function handleKeyup(e: any) {
		if ([13, 45].includes(e.keyCode)) {
			if (!activeOption) {
				;(e.target.value || '')
					.trim()
					.split(' ')
					.forEach((value: string) => {
						if (!selected[value]) {
							add({
								[optionText]: value,
								[optionValue]: value
							})
						}
					})
			} else {
				Object.keys(selected).includes(activeOption[optionValue])
					? remove(activeOption[optionValue])
					: add(activeOption)
			}
			inputValue = ''
		}
		if ([38, 40].includes(e.keyCode)) {
			const increment = e.keyCode === 38 ? -1 : 1
			const calcIndex = filtered.indexOf(activeOption) + increment
			activeOption =
				calcIndex < 0
					? filtered[filtered.length - 1]
					: calcIndex === filtered.length
					? filtered[0]
					: filtered[calcIndex]
		}
	}

	function handleBlur(e: any) {
		optionsVisibility(false)
	}

	function handleTokenClick(e: any) {
		if (e.target.closest('.token-remove')) {
			e.stopPropagation()
			remove(e.target.closest('.token').dataset.id)
		} else if (e.target.closest('.remove-all')) {
			selected = []
			inputValue = ''
		} else {
			optionsVisibility(true)
		}
	}

	function handleOptionMousedown(e: any) {
		const value = e.target.dataset.value
		console.log('handleOptionMousedown', value, selected)
		if (selected[value]) {
			remove(value)
		} else {
			add(
				options.find((option) => {
					return option[optionValue] === value
				})
			)
			input.focus()
		}
	}
</script>

<div
	class="input input-rounded input-bordered flex items-center relative h-auto min-h-12 py-2"
	bind:this={el}
	class:readonly
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="flex-1 flex flex-wrap -mt-2 -ml-2" on:click|preventDefault={handleTokenClick}>
		{#each Object.values(selected) as option}
			<div
				class="flex items-center space-x-2 gap-2 ml-2 mt-2 pl-3 pr-2 h-8 rounded-full bg-base-300"
				data-id={option[optionValue]}
			>
				<span class="leading-none">{option[optionText]}</span>
				{#if !readonly}
					<button>
						<svg
							class="text-base"
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d={iconClearPath} />
						</svg>
					</button>
				{/if}
			</div>
		{/each}

		{#if !readonly}
			<input
				class="flex-1 ml-2 mt-2 bg-transparent focus:outline-none"
				{id}
				{placeholder}
				autocomplete="off"
				bind:this={input}
				bind:value={inputValue}
				on:blur|preventDefault={handleBlur}
				on:keyup|preventDefault={handleKeyup}
			/>
			<!-- <div class="remove-all" title="Remove All" class:hidden={!Object.keys(selected).length}>
				<svg
					class="icon-clear"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
				>
					<path d={iconClearPath} />
				</svg>
			</div> -->
			<svg
				width="18"
				height="18"
				fill="currentColor"
				viewBox="0 0 18 18"
				xmlns="http://www.w3.org/2000/svg"
				class="text-base absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none select-none"
			>
				<path d="M5 8l4 4 4-4z" />
			</svg>
		{/if}
	</div>

	<select bind:this={slot} type="multiple" class="hidden">
		<slot />
	</select>

	<div bind:this={optionsEl} class="fixed bg-base-200 w-full">
		{#if showOptions}
			<ul
				class=""
				transition:fly={{ duration: 200, y: 5 }}
				on:mousedown|preventDefault={handleOptionMousedown}
			>
				{#each filtered as option}
					<li
						class={cn(
							'cursor-pointer px-4 py-2 bg-base-200  hover:text-white',
							selected[option[optionValue]] ? 'bg-primary text-white' : 'hover:bg-base-300',
							{
								'hover:bg-base-300': activeOption === option
							}
						)}
						data-value={option[optionValue]}
					>
						{option[optionText]}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	/* .multiselect {
		background-color: white;
		border-bottom: 1px solid hsl(0, 0%, 70%);
	}
	.multiselect:not(.readonly):hover {
		border-bottom-color: hsl(0, 0%, 50%);
	}

	.tokens {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}
	.tokens::after {
		background: none repeat scroll 0 0 transparent;
		bottom: -1px;
		content: '';
		display: block;
		height: 2px;
		left: 50%;
		position: absolute;
		background: hsl(45, 100%, 51%);
		transition: width 0.3s ease 0s, left 0.3s ease 0s;
		width: 0;
	}
	.tokens.showOptions::after {
		width: 100%;
		left: 0;
	}
	.token {
		align-items: center;
		background-color: hsl(214, 17%, 92%);
		border-radius: 1.25rem;
		display: flex;
		margin: 0.25rem 0.5rem 0.25rem 0;
		max-height: 1.3rem;
		padding: 0.25rem 0.5rem 0.25rem 0.5rem;
		transition: background-color 0.3s;
		white-space: nowrap;
	}
	.token:hover {
		background-color: hsl(214, 15%, 88%);
	}
	.readonly .token {
		color: hsl(0, 0%, 40%);
	}
	.token-remove,
	.remove-all {
		align-items: center;
		background-color: hsl(214, 15%, 55%);
		border-radius: 50%;
		color: hsl(214, 17%, 92%);
		display: flex;
		justify-content: center;
		height: 1.25rem;
		margin-left: 0.25rem;
		min-width: 1.25rem;
	}
	.token-remove:hover,
	.remove-all:hover {
		background-color: hsl(215, 21%, 43%);
		cursor: pointer;
	}

	.actions {
		align-items: center;
		display: flex;
		flex: 1;
		min-width: 15rem;
	}

	input {
		border: none;
		font-size: 1.5rem;
		line-height: 1.5rem;
		margin: 0;
		outline: none;
		padding: 0;
		width: 100%;
	}

	.dropdown-arrow path {
		fill: hsl(0, 0%, 70%);
	}
	.multiselect:hover .dropdown-arrow path {
		fill: hsl(0, 0%, 50%);
	}

	.icon-clear path {
		fill: white;
	}

	.options {
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px -2px 4px rgba(0, 0, 0, 0.1);
		list-style: none;
		margin-block-end: 0;
		margin-block-start: 0;
		max-height: 70vh;
		overflow: auto;
		padding-inline-start: 0;
		width: 100%;
	}
	li {
		background-color: white;
		cursor: pointer;
		padding: 0.5rem;
	}
	li:last-child {
		border-bottom-left-radius: 0.2rem;
		border-bottom-right-radius: 0.2rem;
	}
	li:not(.selected):hover {
		background-color: hsl(214, 17%, 92%);
	}
	li.selected {
		background-color: hsl(232, 54%, 41%);
		color: white;
	}
	li.selected:nth-child(even) {
		background-color: hsl(232, 50%, 45%);
		color: white;
	}
	li.active {
		background-color: hsl(214, 17%, 88%);
	}
	li.selected.active,
	li.selected:hover {
		background-color: hsl(232, 48%, 50%);
	}

	.hidden {
		display: none;
	} */
</style>
