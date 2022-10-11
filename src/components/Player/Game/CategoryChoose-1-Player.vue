<template>
	<div class="category-guess-component">

		<!-- Player has already guessed a category -->
		<div v-if="room.category">
			<h1>{{ room.playerWhoHaveToGuessCategory?.playerName + ' a(z) ' + room.category + ' kategóriát választotta.' }}</h1>
		</div>

		<div v-else>
			<!-- Another player select a category -->
			<div v-if="player.id !== room.playerWhoHaveToGuessCategory.id">
				<h1>
					{{ room.playerWhoHaveToGuessCategory?.playerName + ' választ kategóriát.' }}
				</h1>
			</div>

			<!-- You must select a category -->
			<div v-else>
				<h1 @click="$store.dispatch('game/getRoom', $socket)">Válassz <span class="underline">kategóriát</span>!</h1>

				<div class="category-buttons">
					<button v-for="(category, categoryIndex) in categories"
						:key="categoryIndex"
						class="button button-prm"
						@click="selectCategory(category)">
						{{ category }}
					</button>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['player', 'room', 'categories'])
	},
	mounted() {
		this.waitingForGuessCategory();

		this.waitingForSomeoneGuessedACategory();
	},
	methods: {
		selectCategory(category) {
			console.log('Category select started', category);
			this.$socket.emit('select_category_to_server', { category: category }, ({ success, message, room }) => {
				// Failed to select category
				if (!success) {
					console.log('Failed to guess category', message);
					return;
				}

				// Category selected successfully
				console.log('Category selected successfully', category);
				this.$store.commit('game/setRoom', room);
			});
		},
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
			});
		},
		waitingForSomeoneGuessedACategory() {
			// On a player guess category
			console.log('Waiting for the user guess category...');
			this.sockets.subscribe('on_guess_category_to_client', ({ success, message, room, category }) => {
				// Error on guess category
				if (!success) {
					console.log('Failed on player guess category', message);
					return;
				}

				// Category successfully guessed by a player, show in screen
				console.log('Category guessed by player', category);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
				this.$store.commit('game/setCategory', category);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.category-buttons {
	button {
		margin-bottom: 8px;
	}
}
</style>