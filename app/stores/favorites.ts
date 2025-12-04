import { defineStore } from 'pinia'

// Load favorites from localStorage
const getSavedFavorites = () => {
	try {
		const saved = localStorage.getItem('favorites')
		return saved ? JSON.parse(saved) : []
	} catch {
		return []
	}
}

export const useMyFavoritesStore = defineStore('favorites', {
	state: () => ({
		favorites: getSavedFavorites() as { id: string; rocket_name: string; rocket_type: string }[],
	}),
	actions: {
		saveToStorage() {
			localStorage.setItem('favorites', JSON.stringify(this.favorites))
		},
		addFavorites(rocket: { id: string; rocket_name: string; rocket_type: string }) {
			this.favorites.push(rocket)
			this.saveToStorage()
		},
		removeFavorite(id: string) {
			this.favorites = this.favorites.filter((r) => r.id !== id)
			this.saveToStorage()
		},
		clearFavorites() {
			this.favorites = []
			this.saveToStorage()
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
