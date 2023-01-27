<script lang="ts">
</script>

<div {...$$restProps} class="dropdown dropdown-end {$$props.class || ''}">
	<slot name="activator">
		<button class="btn m-1">Click</button>
	</slot>
	<div class="dropdown-content !fixed shadow bg-base-100 rounded-box w-52">
		<slot />
	</div>
</div>
