<template>
	<v-contaier>
		<!-- title SpaceX Launches -->
		<h2>
			<v-icon icon="mdi-rocket" />
			SpaceX Launches
		</h2>

		<!-- Handle Loading and Error -->
		<div v-if="loading">Loading launches</div>
		<div v-if="error">Error</div>

		<!-- Launches table -->
		<v-table v-if="launches.length">
			<thead>
				<tr>
					<th>Misson Name</th>
					<th>Launch Date</th>
					<th>Launch Site</th>
					<th>Rocke Name</th>
					<th>Details</th>
				</tr>
			</thead>
		</v-table>
	</v-contaier>
</template>
