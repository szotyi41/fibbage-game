<template>
	<div class="category-guess-component">
		<!-- Category is selected -->
		<div v-if="room?.category?.length">
			<h1>
				{{ room?.playerWhoHaveToGuessCategory?.playerName + ' a(z) ' + room?.category + ' kategóriát választotta' }}
			</h1>
		</div>

		<!-- Category not selected yet -->
		<div v-if="!room.category">
			<div>
				<!-- Show player name who guess category -->
				<h1>
					{{ room.playerWhoHaveToGuessCategory?.playerName + ' választ kategóriát'}}
				</h1>

				<!-- List of categories -->
				<div className="guess-categories">
					<div className="category" v-for="(category, categoryIndex) in categories" :key="categoryIndex">
						{{ category }}
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room', 'players', 'categories'])
	},
	mounted() {
		// When room categories component mounted, get categories
		this.getCategories();

		this.waitingForGuessCategory();

		this.waitingForSomeoneGuessedACategory();
	},
	methods: {
		getCategories() {
			console.log('Get random categories');
			this.$socket.emit('get_categories_to_server', {}, ({ success, message, room }) => {
				// Failed to get categories
				if (!success) {
					console.log('Failed to get categories: ', message);
					return;
				}

				// Categories successfully queried
				console.log('Categories queried successfully', room.categories);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setCategories', room.categories);
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