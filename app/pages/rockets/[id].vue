<template>
	<v-container>
		<div v-if="loading">Loading rocket details...</div>
		<div v-else-if="error">Error fetching rocket</div>
		<div v-else-if="!rocket">Rocket not found</div>

		<div v-else>
			<h2>{{ rocket.name }}</h2>
			<p>{{ rocket.description }}</p>

			<v-list>
				<v-list-item>
					<strong>First Flight:</strong>
					{{ rocket.first_flight ?? 'N/A' }}
				</v-list-item>
				<v-list-item>
					<strong>Height:</strong>
					{{ rocket.height?.meters ?? 'N/A' }} m / {{ rocket.height?.feet ?? 'N/A' }} ft
				</v-list-item>
				<v-list-item>
					<strong>Diameter:</strong>
					{{ rocket.diameter?.meters ?? 'N/A' }} m / {{ rocket.diameter?.feet ?? 'N/A' }} ft
				</v-list-item>
				<v-list-item>
					<strong>Mass:</strong>
					{{ rocket.mass?.kg ?? 'N/A' }} kg / {{ rocket.mass?.lb ?? 'N/A' }} lb
				</v-list-item>
				<v-list-item>
					<strong>Stages:</strong>
					{{ rocket.stages ?? 'N/A' }}
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

const route = useRoute()
const rocketId = route.params.id as string

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

const { result, loading, error, load } = useLazyQuery(GET_ROCKET, { id: rocketId })

// Safely access the rocket object
const rocket = computed(() => result.value?.rocket ?? null)

onMounted(() => {
	load()
})
</script>
