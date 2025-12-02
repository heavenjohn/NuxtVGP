<template>
	<v-container>
		<div v-if="loading">Loading rocket details...</div>
		<div v-if="error">Error fetching data.</div>

		<div v-if="rocket">
			<h2>{{ rocket.name }}</h2>
			<p>{{ rocket.description }}</p>

			<v-list>
				<v-list-item>
					<strong>First Flight:</strong>
					{{ rocket?.first_flight ?? 'N/A' }}
				</v-list-item>
				<v-list-item>
					<strong>Height:</strong>
					{{ rocket?.height.meters ?? 'N/A' }} m / {{ rocket.height.feet ?? 'N/A' }} ft
				</v-list-item>
				<v-list-item>
					<strong>Diameter:</strong>
					{{ rocket?.diameter?.meters ?? 'n/a' }} m / {{ rocket?.diameter?.feet ?? 'n/a' }} ft
				</v-list-item>
				<v-list-item>
					<strong>Mass:</strong>
					{{ rocket?.mass?.kg ?? 'n/a' }} kg / {{ rocket?.mass?.lb ?? 'n/a' }} lb
				</v-list-item>
				<v-list-item>
					<strong>Stages:</strong>
					{{ rocket?.stages ?? 'n/a' }}
				</v-list-item>
			</v-list>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Get rocket ID from Route params
const route = useRoute()
const rocketId = route.params.id as string

// GraphQl query for a signle rocket
const GET_ROCKET = gql`
	query getRocket($id: ID!) {
		rocket(id: $id) {
			id
			name
			description
			first_flight
			height {
				meters
				feet
			}
			diameter {
				meters
				feet
			}
			mass {
				kg
				lb
			}
			stages
		}
	}
`

// Fetch the rocket data
const { result, loading, error, load } = useLazyQuery(GET_ROCKET, { id: rocketId })

//computed property for easier access
const rocket = computed(() => result.value?.rocket ?? {})

//Load data when component mounts
onMounted(() => {
	load()
})
</script>
