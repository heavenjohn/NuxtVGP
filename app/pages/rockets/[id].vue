<template>
	<v-container class="py-10 rocket-bg">
		<!-- Loading / Error States -->
		<div v-if="loading" class="text-center text-h6 py-10">Loading rocket details...</div>
		<div v-else-if="error" class="text-center text-h6 py-10 text-error">Error fetching rocket data.</div>
		<div v-else-if="!rocket" class="text-center text-h6 py-10">Rocket not found.</div>

		<!-- Rocket Details -->
		<div v-else>
			<v-card class="rocket-card mx-auto pa-6" elevation="6" max-width="900">
				<!-- Title -->
				<h2 class="rocket-title mb-2">{{ rocket.name }}</h2>
				<p class="rocket-description mb-6">{{ rocket.description }}</p>

				<!-- Details List -->
				<v-list density="compact">
					<v-list-item>
						<strong>First Flight:</strong>
						<span class="ml-2">{{ rocket.first_flight ?? 'N/A' }}</span>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item>
						<strong>Height:</strong>
						<span class="ml-2">
							{{ rocket.height?.meters ?? 'N/A' }} m / {{ rocket.height?.feet ?? 'N/A' }} ft
						</span>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item>
						<strong>Diameter:</strong>
						<span class="ml-2">
							{{ rocket.diameter?.meters ?? 'N/A' }} m / {{ rocket.diameter?.feet ?? 'N/A' }} ft
						</span>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item>
						<strong>Mass:</strong>
						<span class="ml-2">
							{{ rocket.mass?.kg ?? 'N/A' }} kg / {{ rocket.mass?.lb ?? 'N/A' }} lb
						</span>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item>
						<strong>Stages:</strong>
						<span class="ml-2">{{ rocket.stages ?? 'N/A' }}</span>
					</v-list-item>
				</v-list>

				<!-- Back Button -->
				<div class="d-flex justify-end mt-8">
					<NuxtLink to="/">
						<v-btn color="primary" rounded="lg">Go Back</v-btn>
					</NuxtLink>
				</div>
			</v-card>
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
const rocket = computed(() => result.value?.rocket ?? null)

onMounted(() => {
	load()
})
</script>

<style scoped>
.rocket-bg {
	background: #fff;
	min-height: 100vh;
}

/* Card */
.rocket-card {
	margin-top: 20px;
	background: #ffffffee;
	border-radius: 20px;
	backdrop-filter: blur(6px);
}

/* Title */
.rocket-title {
	font-size: 32px;
	font-weight: 800;
	color: #222;
}

/* Description */
.rocket-description {
	font-size: 16px;
	color: #555;
	line-height: 1.6;
}
</style>
