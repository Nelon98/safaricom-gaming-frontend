<script lang="ts">
	// 1. Point this to your renamed app.css
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<title>Safaricom Gaming Hub | Nairobi Tournament</title>
</svelte:head>

<div class="min-h-screen w-full flex flex-col overflow-x-hidden">
	{@render children()}
</div>