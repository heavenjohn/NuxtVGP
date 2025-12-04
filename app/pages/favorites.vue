<template>
	<v-container fluid class="favorites-bg py-10">
		<!-- Page Title -->
		<div class="d-flex align-center mb-8">
			<v-icon icon="mdi-heart" size="40" class="mr-3 text-accent" />
			<h1 class="page-title">Favorite Rockets</h1>
		</div>

		<!-- Clear All Button -->
		<div class="d-flex justify-end mb-8">
			<v-btn
				v-if="favoritesStore.favorites.length > 0"
				color="accent"
				prepend-icon="mdi-delete"
				variant="flat"
				rounded="lg"
				@click="favoritesStore.clearFavorites()"
			>
				Clear Favorites
			</v-btn>
		</div>

		<!-- Favorites Grid -->
		<v-row>
			<v-col v-for="rocket in favoritesStore.favorites" :key="rocket.id" cols="12" sm="6" md="4" lg="3">
				<v-card class="glass-card hover-card px-4 py-6" elevation="4">
					<!-- Rocket Name -->
					<v-card-title class="card-title text-center mb-1">
						{{ rocket.rocket_name }}
					</v-card-title>

					<!-- Rocket Type -->
					<v-card-subtitle class="card-subtitle text-center mb-4">
						{{ rocket.rocket_type }}
					</v-card-subtitle>

					<!-- Buttons -->
					<v-card-actions class="d-flex justify-center gap-3 flex-wrap">
						<NuxtLink :to="`/rockets/${rocket.id}`">
							<v-btn color="primary" variant="flat" size="small" rounded="md">
								View Rocket
							</v-btn>
						</NuxtLink>

						<v-btn
							icon
							color="red-darken-1"
							variant="text"
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
		<v-alert
			v-if="favoritesStore.favorites.length === 0"
			type="info"
			rounded="lg"
			variant="tonal"
			class="mt-12 text-center glass-card py-8"
		>
			No favorite rockets yet. Add some from the launches page!
		</v-alert>
	</v-container>
</template>

<script lang="ts" setup>
import { useMyFavoritesStore } from '@/stores/favorites'
const favoritesStore = useMyFavoritesStore()
</script>

<style scoped>
/* PAGE BACKGROUND */
.favorites-bg {
	background: #fafafa;
	min-height: 100vh;
	padding-bottom: 60px;
}

/* PAGE TITLE */
.page-title {
	color: #111;
	font-size: 34px;
	font-weight: 800;
	letter-spacing: -0.5px;
}

/* CARD - Modern UI */
.glass-card {
	background: rgba(255, 255, 255, 0.85);
	border-radius: 18px;
	border: 1px solid rgba(0, 0, 0, 0.08);
	backdrop-filter: blur(8px);
	transition: 0.25s ease;
}

/* HOVER EFFECT */
.hover-card:hover {
	transform: translateY(-6px);
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

/* TITLE STYLE */
.card-title {
	font-size: 20px;
	font-weight: 700;
	color: #111;
}

/* SUBTITLE */
.card-subtitle {
	color: #666;
	font-size: 14px;
	font-weight: 500;
	margin-top: -2px;
}

/* FIXED ICON COLOR */
.text-accent {
	color: #b8001f;
}

/* BUTTON STYLING */
.v-btn {
	text-transform: none !important;
	font-weight: 600;
	border-radius: 10px !important;
}
</style>
