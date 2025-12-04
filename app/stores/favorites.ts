import { defineStore } from 'pinia'

export const useMyFavoritesStore = defineStore('favorites', {
	state: () => ({
		favorites: [] as { id: string; rocket_name: string; rocket_type: string }[],
	}),
	actions: {
		addFavorites(rocket: { id: string; rocket_name: string; rocket_type: string }) {
			this.favorites.push(rocket)
		},
		removeFavorite(id: string) {
			this.favorites = this.favorites.filter((r) => r.id !== id)
		},
		clearFavorites() {
			this.favorites = []
		},
		toggleFavorite(rocket: { id: string; rocket_name: string; rocket_type: string }) {
			const exists = this.favorites.some((f) => f.id === rocket.id)
			if (exists) {
				this.removeFavorite(rocket.id)
			} else {
				this.addFavorites(rocket)
			}
		},
	},
})
