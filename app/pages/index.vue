<template>
	<v-container fluid class="launches-bg py-10">
		<v-row justify="center">
			<v-col cols="12" md="12" lg="11" xl="10">
				<!-- PAGE HEADER -->
				<div class="d-flex align-center mb-8 page-header">
					<v-icon icon="mdi-rocket-launch" size="44" class="mr-3 text-accent" />
					<h1 class="page-title">SpaceX Launches</h1>
				</div>

				<!-- LOADING / ERROR -->
				<v-alert v-if="loading" type="info" variant="tonal" class="mb-4 glass-card">
					Fetching latest launches...
				</v-alert>

				<v-alert v-if="error" type="error" variant="tonal" class="mb-4 glass-card">
					Unable to load launch data.
				</v-alert>

				<!-- FILTERS CARD -->
				<v-card class="pa-6 mb-10 glass-card" elevation="4">
					<h3 class="filter-title mb-6">Filters</h3>

					<v-row>
						<v-col cols="12" md="6">
							<v-select
								v-model="selectedYear"
								:items="years"
								label="Filter by Launch Year"
								prepend-inner-icon="mdi-calendar"
								variant="solo-filled"
								density="comfortable"
							/>
						</v-col>

						<v-col cols="12" md="6">
							<v-select
								v-model="sortOrder"
								label="Sort by Launch Date"
								prepend-inner-icon="mdi-sort-clock-descending-outline"
								variant="solo-filled"
								density="comfortable"
								:items="[
									{ title: 'Newest First', value: 'desc' },
									{ title: 'Oldest First', value: 'asc' },
								]"
							/>
						</v-col>
					</v-row>
				</v-card>

				<!-- LAUNCH TABLE -->
				<v-card class="glass-card" elevation="6">
					<v-table v-if="launches.length" class="launch-table">
						<thead>
							<tr>
								<th>Mission</th>
								<th>Date</th>
								<th>Launch Site</th>
								<th>Rocket</th>
								<th>Details</th>
								<th>Favorite</th>
							</tr>
						</thead>

						<tbody>
							<tr
								v-for="launch in sortedFilterLaunches"
								:key="launch.mission_name"
								class="launch-row"
							>
								<td class="mission-name">
									{{ launch.mission_name }}
								</td>

								<td>{{ new Date(launch.launch_date_local).toLocaleDateString() }}</td>

								<td>{{ launch.launch_site?.site_name ?? 'Unknown' }}</td>

								<td>
									<NuxtLink
										v-if="launch.rocket?.rocket"
										:to="`/rockets/${launch.rocket.rocket.id}`"
										class="rocket-link"
									>
										{{ launch.rocket.rocket_name }}
									</NuxtLink>

									<span v-else class="text-muted">Unavailable</span>
								</td>
								<td class="details-col">
									{{ launch.details ?? 'N/A' }}
								</td>
								<td>
									<v-btn
										icon
										:color="launch.isFavorite ? 'pink' : 'grey'"
										:disabled="!launch.rocket?.rocket"
										size="small"
										@click="toggleRowFavorite(launch)"
									>
										<v-icon>
											{{ launch.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
										</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</v-table>

					<!-- EMPTY STATE -->
					<div v-else class="text-center py-10 text-grey-lighten-1">
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
import { computed, onMounted, ref } from 'vue'

interface Launch {
	mission_name: string
	launch_date_local: string
	launch_site: { site_name: string }
	rocket: { rocket_name: string; rocket_type: string; rocket: { id: string } } | null
	details: string | null
	isFavorite?: boolean
}

const favoritesStore = useMyFavoritesStore()

const GET_LAUNCHES = gql`
	query getLaunches {
		launchesPast(limit: 20) {
			mission_name
			launch_date_local
			launch_site {
				site_name
			}
			rocket {
				rocket_name
				rocket_type
				rocket {
					id
				}
			}
			details
		}
	}
`

const { result, loading, error, load } = useLazyQuery(GET_LAUNCHES)
const launches = ref<Launch[]>([])

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

// --- FAVORITES HANDLERS ---
// Check if rocket is favorite
const isFavorite = (rocket: Launch['rocket']) => {
	if (!rocket?.rocket) return false
	return favoritesStore.favorites.some((r) => r.id === rocket.rocket.id)
}

// Toggle favorite and save to store
const toggleRowFavorite = (launch: Launch) => {
	if (!launch.rocket?.rocket) return
	const rocketData = {
		id: launch.rocket.rocket.id,
		rocket_name: launch.rocket.rocket_name,
		rocket_type: launch.rocket.rocket_type,
	}
	favoritesStore.toggleFavorite(rocketData)
	launch.isFavorite = isFavorite(launch.rocket) // update local row color
}

// Load launches
onMounted(async () => {
	await load()
	launches.value = (result.value?.launchesPast ?? []).map((l: any) => ({
		...l,
		isFavorite: l.rocket ? isFavorite(l.rocket) : false,
	}))
})
</script>

<style scoped>
/* Background stays dark, but text will be brighter */
.launches-bg {
	min-height: 100vh;
	background: #ffffff;
}

/* PAGE TITLE */
.page-title {
	color: #000;
	font-size: 38px;
	font-weight: 800;
}

/* LIGHTER accent icon */
.text-accent {
	color: #93c5fd;
}

/* FILTER TITLE */
.filter-title {
	color: #000;
	font-size: 20px;
	font-weight: 700;
}

/* VERY READABLE GLASS CARD */
.glass-card {
	background: rgba(255, 255, 255, 0.12);
	border-radius: 18px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(8px);
}

/* TABLE HEADER — BRIGHTER */
.launch-table th {
	background: rgba(255, 255, 255, 0.18);
	color: #000;
	font-weight: 700;
	font-size: 15px;
	padding: 14px;
}

/* TABLE TEXT — MUCH BRIGHTER */
.launch-table td {
	color: #000;
	font-size: 15px;
	padding: 14px;
}

/* ROW HOVER */
.launch-row:hover {
	background: rgba(255, 255, 255, 0.22);
}

/* LINKS */
.rocket-link {
	color: #60a5fa;
	font-weight: 700;
}

.rocket-link:hover {
	color: #93c5fd;
	text-decoration: underline;
}

/* DETAILS COLUMN MORE READABLE */
.details-col {
	max-width: 260px;
	white-space: normal;
	color: #000;
}

.mission-name {
	font-weight: 800;
	color: #000;
}
</style>
