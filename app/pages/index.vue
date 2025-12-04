<template>
	<v-container fluid class="launches-bg py-10">
		<v-row justify="center">
			<v-col cols="12" md="10" lg="8">
				<!-- Page Header -->
				<div class="d-flex align-center mb-6 page-header">
					<v-icon icon="mdi-rocket-launch" size="40" class="mr-3 text-white" />
					<h1 class="page-title">SpaceX Launches</h1>
				</div>

				<!-- Loading / Error -->
				<v-alert v-if="loading" type="info" variant="tonal" class="mb-4 glass-card">
					Fetching launch data…
				</v-alert>
				<v-alert v-if="error" type="error" variant="tonal" class="mb-4 glass-card">
					Error loading data. Please try again.
				</v-alert>

				<!-- Filters -->
				<v-card class="pa-6 mb-8 glass-card">
					<h3 class="mb-4 text-white">Filters</h3>
					<v-row>
						<v-col cols="12" md="6">
							<v-select
								v-model="selectedYear"
								label="Filter by Year"
								:items="years"
								variant="solo-filled"
								prepend-inner-icon="mdi-calendar"
							/>
						</v-col>
						<v-col cols="12" md="6">
							<v-select
								v-model="sortOrder"
								label="Sort by Date"
								variant="solo-filled"
								prepend-inner-icon="mdi-sort"
								:items="[
									{ title: 'Newest First', value: 'desc' },
									{ title: 'Oldest First', value: 'asc' },
								]"
							/>
						</v-col>
					</v-row>
				</v-card>

				<!-- Launch Table -->
				<v-card elevation="4" class="glass-card">
					<v-table v-if="launches.length" class="launch-table">
						<thead>
							<tr>
								<th>Mission</th>
								<th>Date</th>
								<th>Site</th>
								<th>Rocket</th>
								<th>Favorite</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="launch in sortedFilterLaunches"
								:key="launch.mission_name"
								class="launch-row"
							>
								<td>{{ launch.mission_name }}</td>
								<td>{{ new Date(launch.launch_date_local).toLocaleString() }}</td>
								<td>{{ launch.launch_site?.site_name ?? 'Unknown' }}</td>

								<!-- Rocket Name with Link -->
								<td>
									<NuxtLink
										v-if="launch.rocket?.rocket"
										:to="`/rockets/${launch.rocket.rocket.id}`"
										class="rocket-link"
									>
										{{ launch.rocket.rocket_name }}
									</NuxtLink>
									<span v-else class="text-muted">Unknown</span>
								</td>

								<!-- Details -->
								<td>{{ launch.details ?? 'N/A' }}</td>
								<!-- Favorite Button -->
								<td>
									<v-btn
										icon
										:color="
											launch.rocket?.rocket && isFavorite(launch.rocket.rocket)
												? 'pink'
												: 'grey'
										"
										:disabled="!launch.rocket?.rocket"
										@click="launch.rocket?.rocket && toggleFavorite(launch.rocket)"
									>
										<v-icon>
											{{
												launch.rocket?.rocket && isFavorite(launch.rocket.rocket)
													? 'mdi-heart'
													: 'mdi-heart-outline'
											}}
										</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</v-table>

					<!-- Empty State -->
					<div v-else class="text-center py-10 text-grey-lighten-2">
						No launches match your filters.
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import { useMyFavoritesStore } from '@/stores/favorites'
import { useLazyQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { computed, ref } from 'vue'

interface Launch {
	mission_name: string
	launch_date_local: string
	launch_site: { site_name: string }
	rocket: {
		rocket_type: string
		rocket_name: string
		rocket: { id: string }
	} | null
	details: string | null
}

// Apollo GraphQL
const GET_LAUNCHES = gql`
	query getLaunches {
		launchesPast(limit: 20) {
			mission_name
			launch_date_local
			launch_site {
				site_name
			}
			rocket {
				rocket_type
				rocket_name
				rocket {
					id
				}
			}
			details
		}
	}
`

const { result, loading, error, load } = useLazyQuery(GET_LAUNCHES)
const launches = computed(() => (result.value?.launchesPast ?? []) as Launch[])

// Filters
const selectedYear = ref('all')
const sortOrder = ref<'asc' | 'desc'>('desc')

const filteredLaunches = computed(() =>
	selectedYear.value === 'all'
		? launches.value
		: launches.value.filter(
				(l) => new Date(l.launch_date_local).getFullYear().toString() === selectedYear.value,
			),
)

const sortedFilterLaunches = computed(() => {
	const list = filteredLaunches.value.slice()
	return list.sort((a, b) => {
		const dateA = new Date(a.launch_date_local).getTime()
		const dateB = new Date(b.launch_date_local).getTime()
		return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
	})
})

const years = computed(() => {
	const set = new Set(launches.value.map((l) => new Date(l.launch_date_local).getFullYear().toString()))
	return ['all', ...Array.from(set)]
})

// Pinia favorites store
const favoritesStore = useMyFavoritesStore()

// Toggle favorite
const toggleFavorite = (rocketData: { rocket_name: string; rocket_type: string; rocket: { id: string } }) => {
	favoritesStore.toggleFavorite({
		id: rocketData.rocket.id,
		rocket_name: rocketData.rocket_name,
		rocket_type: rocketData.rocket_type,
	})
}

// Check if rocket is favorite
const isFavorite = (rocket: { id: string }) => favoritesStore.favorites.some((f) => f.id === rocket.id)

load()
</script>

<style scoped>
.launches-bg {
	background: linear-gradient(160deg, #020617 0%, #0b1225 50%, #111827 100%);
	min-height: 100vh;
	padding-bottom: 60px;
}
.page-title {
	color: white;
	font-size: 32px;
	font-weight: 700;
}
.glass-card {
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(8px);
	border-radius: 18px !important;
}
.launch-table {
	color: black;
}
.launch-table th {
	background: rgba(255, 255, 255, 0.12);
	color: #cbd5e1;
	font-size: 14px;
}
.launch-row {
	transition: background 0.2s ease;
}
.launch-row:hover {
	background: rgba(255, 255, 255, 0.1);
}
.rocket-link {
	color: #60a5fa;
	text-decoration: none;
}
.rocket-link:hover {
	text-decoration: underline;
}
</style>
