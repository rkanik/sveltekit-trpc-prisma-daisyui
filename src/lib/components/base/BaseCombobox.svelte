<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import cn from 'classnames'
	import BaseTeleport from './BaseTeleport.svelte'

	// Options
	type OptionsProps = any[] | ((q?: string) => Promise<any[]>)

	let optionHeight = 48
	let optionsMaxHeight = 384
	let filtered: any[] = []
	let innerOptions: any[] = []
	export let options: OptionsProps = []

	const fetchOptions = async () => {
		if (Array.isArray(options)) return options
		if (typeof options === 'function') {
			return await options()
		}
		return []
	}

	$: {
		filtered = inputValue
			? innerOptions.filter((option) => {
					return option[optionText].toLowerCase().includes(inputValue.toLowerCase())
			  })
			: innerOptions
	}

	// $: if (value && innerOptions.length) {
	// 	console.log({ innerOptions, value, selected })
	// }

	onMount(async () => {
		console.log('combobox:onMount')
		innerOptions = await fetchOptions()
		selected = value
			? innerOptions.reduce((selected, option) => {
					return value.includes(option.value)
						? { ...selected, [option.value]: option }
						: selected
			  }, {})
			: selected
	})

	export let id = ''

	export let optionText = 'text'
	export let optionValue = 'value'
	export let returnObject = false
	export let value: any[] = []
	export let readonly = false
	export let placeholder = ''

	let input: any,
		inputValue: any,
		activeOption: any,
		showOptions = false,
		selected: any = {},
		first = true,
		slot: any

	let el: HTMLDivElement
	let optionsEl: HTMLDivElement

	const iconClearPath =
		'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

	onMount(() => {
		first = false
	})

	$: if (el && optionsEl && showOptions) {
		const rect = el.getBoundingClientRect()
		const offsetTop = rect.top + rect.height

		let possibleHeight = filtered.length * optionHeight
		possibleHeight = possibleHeight <= optionsMaxHeight ? possibleHeight : optionsMaxHeight

		const canFitToBottom = window.innerHeight - (offsetTop + possibleHeight) > 0

		optionsEl.style.cssText += `
			z-index:9999;
			left:${rect.left}px;
			width:${rect.width}px;
		`
		optionsEl.style.cssText += canFitToBottom
			? `top:${offsetTop}px;`
			: `top:${rect.top - possibleHeight}px;`
	}

	$: if (!first) {
		value = returnObject
			? Object.values(selected)
			: Object.values(selected).map((option) => {
					return option[optionValue]
			  })
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
				innerOptions.find((option) => {
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

	<BaseTeleport to="body">
		<div bind:this={optionsEl} class="fixed">
			{#if showOptions}
				<div class="p-2 bg-gray-600 overflow-hidden rounded-lg">
					<ul
						class="menu max-h-96 overflow-y-auto flex-nowrap"
						transition:fly={{ duration: 200, y: 5 }}
						on:mousedown|preventDefault={handleOptionMousedown}
					>
						{#each filtered as option}
							<li>
								<a
									data-value={option[optionValue]}
									href="javascript:void(0)"
									on:click={(e) => e.preventDefault()}
									class={cn('rounded-lg', {
										'bg-black bg-opacity-20': activeOption === option,
										'bg-purple-500 bg-opacity-20 text-white':
											selected[option[optionValue]]
									})}
								>
									{option[optionText]}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</BaseTeleport>
</div>
