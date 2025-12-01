<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-rocket" />
			SpaceX Launches
		</h2>

		<div v-if="loading">Loading...</div>
		<div v-if="error">Error</div>

		<!-- Date year -->
		<div>
			<label>Filter by Year :</label>
			<select v-model="selectedYear">
				<option v-for="year in years" :key="year">{{ year }}</option>
			</select>
		</div>

		<!-- Add Selector -->
		<div>
			<label>Sort by date :</label>
			<select v-model="sortOrder">
				<option value="desc">Newest First</option>
				<option value="asc">Oldest First</option>
			</select>
		</div>

		<!-- Dat's of launches for SpaceX -->
		<v-table v-if="launches.length">
			<thead>
				<tr>
					<th>Mission</th>
					<th>Date</th>
					<th>Site</th>
					<th>Rocket</th>
					<th>Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="launch in sortedFilterLaunches" :key="launch.mission_name">
					<td>{{ launch.mission_name }}</td>
					<td>{{ new Date(launch.launch_date_local).toLocaleString() }}</td>
					<td>{{ launch.launch_site?.site_name ?? 'Unknown' }}</td>
					<td>{{ launch.rocket?.rocket_name ?? 'Unknown' }}</td>
					<td>{{ launch.details ?? 'N/A' }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>

<script lang="ts" setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { computed, ref } from 'vue'

interface Launch {
	mission_name: string
	launch_date_local: string
	launch_site: { site_name: string }
	rocket: { rocket_name: string }
	details: string | null
}

// GraphQL query
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
			}
			details
		}
	}
`

// fetch API's
const { result, loading, error, load } = useLazyQuery(GET_LAUNCHES)
// Computed launches array
const launches = computed(() => result.value?.launchesPast ?? [])
// Fillter state
const selectedYear = ref('all')

const filteredLaunches = computed(() => {
	if (selectedYear.value === 'all') return launches.value
	return launches.value.filters(
		(l: { launch_date_local: string | number | Date }) =>
			new Date(l.launch_date_local).getFullYear().toString() === selectedYear.value,
	)
})
// Computed Filtered Launches
const sortOrder = ref<'asc' | 'desc'>('desc')
const sortedFilterLaunches = computed<Launch[]>(() => {
	const list = filteredLaunches.value.slice()
	return list.sort(
		(
			a: { launch_date_local: string | number | Date },
			b: { launch_date_local: string | number | Date },
		) => {
			const dateA = new Date(a.launch_date_local).getTime()
			const dateB = new Date(b.launch_date_local).getTime()
			return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
		},
	)
})
// Year automatically
const years = computed<string[]>(() => {
	const set = new Set(
		launches.value.map((l: { launch_date_local: string | number | Date }) =>
			new Date(l.launch_date_local).getFullYear().toString(),
		),
	)
	return ['all', ...(Array.from(set) as string[])]
})

// Execute the lazy query
load()
</script>
