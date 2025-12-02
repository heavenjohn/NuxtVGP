<template>
	<v-container>
		<div v-if="loading">Loading rocket details...</div>
		<div v-if="error">Error fetching data.</div>

		<div v-if="rocket">
			<h2>{{ rocket.name }}</h2>
			<p>{{ rocket.description }}</p>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

</script>
