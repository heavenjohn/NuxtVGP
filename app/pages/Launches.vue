<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-rocket" />
			SpaceX Launches
		</h2>

		<div v-if="loading">Loading...</div>
		<div v-if="error">Error</div>

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
				<tr v-for="launch in launches" :key="launch.mission_name">
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
import { computed } from 'vue'

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

// Use lazy query
const { result, loading, error, load } = useLazyQuery(GET_LAUNCHES)

// Computed launches array
const launches = computed(() => result.value?.launchesPast ?? [])

// Execute the lazy query
load()
</script>
