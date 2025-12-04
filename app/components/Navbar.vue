<template>
	<!-- TOP NAVBAR -->
	<v-app-bar app color="primary" dark>
		<v-toolbar-title>SpaceX Explorer</v-toolbar-title>

		<!-- MOBILE BURGER ICON -->
		<v-app-bar-nav-icon class="d-sm-none" @click="drawer = !drawer" />

		<!-- DESKTOP NAVIGATION -->
		<div class="d-none d-sm-flex align-center">
			<NuxtLink to="/" class="nav-link mx-3">Home</NuxtLink>

			<!-- Rocket Dropdown -->
			<v-menu>
				<template #activator="{ props }">
					<v-btn v-bind="props" variant="text" class="mx-3" style="color: white">Rockets</v-btn>
				</template>

				<v-list>
					<v-list-item v-for="rocket in rockets" :key="rocket.id" :to="`/rockets/${rocket.id}`">
						<v-list-item-title>
							{{ rocket.name }}
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</v-app-bar>

	<!-- MOBILE DRAWER -->
	<v-navigation-drawer v-model="drawer" temporary class="d-sm-none">
		<v-list>
			<v-list-item to="/">
				<v-list-item-title>Home</v-list-item-title>
			</v-list-item>

			<v-list-subheader>Rockets</v-list-subheader>

			<v-list-item v-for="rocket in rockets" :key="rocket.id" :to="`/rockets/${rocket.id}`">
				<v-list-item-title>{{ rocket.name }}</v-list-item-title>
			</v-list-item>

			<v-divider class="my-2" />
		</v-list>
	</v-navigation-drawer>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { computed, ref } from 'vue'

// Drawer state for mobile
const drawer = ref(false)

// Fetch Rockets
const GET_ROCKETS = gql`
	query {
		rockets {
			id
			name
		}
	}
`
const { result } = useQuery(GET_ROCKETS)
const rockets = computed(() => result.value?.rockets ?? [])
</script>

<style scoped>
.nav-link {
	color: white;
	font-weight: 600;
	text-decoration: none;
}

.nav-link:hover {
	text-decoration: underline;
}
</style>
