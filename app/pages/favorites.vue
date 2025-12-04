<template>
	<v-container class="py-10">
		<h1 class="text-h4 text-center text-md-left mb-6 font-weight-bold">Favorite Rockets</h1>

		<!-- Clear button -->
		<div class="d-flex justify-center justify-md-end mb-4">
			<v-btn
				v-if="favoritesStore.favorites.length > 0"
				color="red darken-2"
				prepend-icon="mdi-delete"
				@click="favoritesStore.clearFavorites()"
			>
				Clear Favorites
			</v-btn>
		</div>

		<v-row>
			<v-col v-for="rocket in favoritesStore.favorites" :key="rocket.id" cols="12" sm="6" md="4" lg="3">
				<v-card class="pa-3" elevation="3">
					<v-card-title class="text-h6 text-center">
						{{ rocket.rocket_name }}
					</v-card-title>
					<v-card-subtitle class="text-center">
						{{ rocket.rocket_type }}
					</v-card-subtitle>
					<v-card-actions class="d-flex justify-center">
						<NuxtLink :to="`/rockets/${rocket.id}`">
							<v-btn color="primary" size="small" variant="flat">View Rocket</v-btn>
						</NuxtLink>
						<v-btn
							icon
							color="red"
							size="small"
							@click="favoritesStore.removeFavorite(rocket.id)"
						>
							<v-icon>mdi-heart-remove</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- Empty State -->
		<v-alert v-if="favoritesStore.favorites.length === 0" type="info" class="mt-8 text-center">
			No favorite rockets yet. Add some from the launch details page!
		</v-alert>
	</v-container>
</template>

<script lang="ts" setup>
import { useMyFavoritesStore } from '@/stores/favorites'
const favoritesStore = useMyFavoritesStore()
</script>

<style scoped>
/* optional: adjust card spacing and text colors */
</style>
