<script lang="ts">
   import type { PageData } from "./$types"
   export let data:PageData
</script>

<div>

   <div>users</div>
<pre><code>{JSON.stringify(data.users,null,2)}</code></pre>
</div>