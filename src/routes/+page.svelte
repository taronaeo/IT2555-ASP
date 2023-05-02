<script lang="ts">
	import { User } from '$lib'
</script>

<svelte:head>
	<title>IT2555-ASP | Kickstarter</title>
</svelte:head>

<section>
	<h1 class="text-4xl">Hello World!</h1>

	<User let:user>
		Hello {user.uid}

		<div slot="signedOut">You are signed out.</div>
	</User>
</section>

<style lang="postcss">
</style>
