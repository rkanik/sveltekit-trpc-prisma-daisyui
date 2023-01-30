<script lang="ts">
	type DataTableHeader = {
		text: string
		value: string | ((item: any, header: DataTableHeader) => string)
	}

	export let actions = true
	export let selectable = true
	export let items: any[] = []
	export let headers: DataTableHeader[] = []
</script>

<table class="base-data-table table table-compact w-full">
	<!-- head -->
	<thead>
		<tr>
			{#if selectable}
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
			{/if}
			{#each headers as header}
				<th>{header.text}</th>
			{/each}
			{#if actions}
				<th />
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each items as item}
			<tr>
				{#if selectable}
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
				{/if}
				{#each headers as header}
					<td>
						<slot
							name="item"
							{item}
							{header}
							value={typeof header.value === 'function'
								? header.value(item, header)
								: item[header.value]}
						>
							{typeof header.value === 'function'
								? header.value(item, header)
								: item[header.value]}
						</slot>
					</td>
				{/each}

				{#if actions}
					<th>
						<slot name="actions" {item}>
							<button class="btn btn-square btn-ghost">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block w-5 h-5 stroke-current"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/></svg
								>
							</button>
						</slot>
					</th>
				{/if}
			</tr>
		{/each}
	</tbody>
	<!-- foot -->
	<tfoot>
		<tr>
			{#if selectable}
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
			{/if}
			{#each headers as header}
				<th>{header.text}</th>
			{/each}
			{#if actions}
				<th />
			{/if}
		</tr>
	</tfoot>
</table>

<style lang="scss">
	.base-data-table :where(th, td) {
		white-space: normal !important;
	}
</style>
