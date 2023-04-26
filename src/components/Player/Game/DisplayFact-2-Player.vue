<template>
	<div class="display-fact-component">

		<h1 class="fact-text" v-if="fact?.fact" v-html="fact.fact"></h1>

		<div v-if="!room.showResultsAfterEverybodyGuessed">

			<!-- Lying -->
			<div v-if="room.waitingForPlayerLying === true">

				<div v-if="!player.lied">
					<LyingPlayer></LyingPlayer>
				</div>

				<div v-else>
					
					<h2>Várd meg míg a többi játékos hazudik!</h2>
				</div>

			</div>


			<!-- Guessing -->
			<div>
				<div v-if="room.waitingForPlayerGuess === true">

					<GuessingPlayer v-if="!player.guessed"></GuessingPlayer>

					<h2 v-else>Várd meg a többi játékos tippjét!</h2>

				</div>
			</div>

		</div>

		<!-- After everybody finished guessing, you must see the screen for results -->
		<div v-else>
			

			<!-- IF results finished -->
			<button class="button button-prm" 
				@click="startNextRound()" 
				:disabled="isStartNextRound"
				v-if="room && room.canGoToNextQuestion === true && !room.showRound">
				Következő kör
			</button>

			<h2 v-else>Nézd a képernyőt!</h2>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import LyingPlayer from './Lying-3-Player.vue';
import GuessingPlayer from './Guessing-4-Player.vue';

export default {
	components: {
		LyingPlayer,
		GuessingPlayer
	},
	computed: {
		...mapState('game', ['room', 'player', 'fact'])
	},
	data() {
		return {
			isStartNextRound: false
		};
	},
	mounted() {
		this.waitingForFact();
		this.waitingForCanGoToNextRoundButton();
	},
	methods: {
		waitingForFact() {
			this.sockets.subscribe('send_fact_to_client', ({ room, fact }) => {
				console.log('Fact queried successfully', room);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setFact', fact);
			});
		},
		waitingForCanGoToNextRoundButton() {
			this.sockets.subscribe('show_can_go_to_next_round_button_to_client', ({ room }) => {
				this.$store.commit('game/setRoom', room);
			});
		},
		startNextRound() {
			this.isStartNextRound = true;
			this.$socket.emit('start_next_round_to_server', {}, ({ room }) => {
				// Categories successfully queried
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setCategories', room.categories);
			});
		}
	}
};
</script>
