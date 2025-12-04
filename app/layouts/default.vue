<template>
	<v-app>
		<Navbar />

		<main class="pa-6">
			<slot />
		</main>

		<Footer />
	</v-app>
</template>
<script>
import Footer from '~/components/Footer.vue'
import Navbar from '~/components/Navbar.vue'

export default {
	name: 'DefaultLayout',
}
</script>

<style scoped>
main {
	min-height: 80vh;
}
</style>
