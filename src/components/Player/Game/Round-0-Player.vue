<template>
	<h1>{{ room.round }}. forduló</h1>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room', 'categories', 'player', 'players'])
	},
	mounted() {
		this.waitingForGuessCategory();
	},
	methods: {
		waitingForGuessCategory() {
			console.log('Waiting for guess category...');
			this.sockets.subscribe('waiting_for_guess_category_to_client', ({ success, message, room, categories }) => {
				// Failed to get categories, which can a player could guess
				if (!success) {
					console.log('Failed to get categories', message);
					return;
				}

				// Get player choosable categories
				console.log('Categories show', room.categories);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
				this.$store.commit('game/setCategories', categories);

				const player = this.players.find((player) => player.id === this.player.id);
				console.log('Update player', player);
				if (player) {
					this.$store.commit('game/setPlayer', player);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
h1 {
	font-size: 32px;
}
</style>