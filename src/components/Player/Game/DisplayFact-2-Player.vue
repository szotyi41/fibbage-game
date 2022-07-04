<template>
	<div class="display-fact-component">

		<h1 v-if="fact?.fact">{{ fact.fact }}</h1>

		<div v-if="!room.showResultsAfterEverybodyGuessed">

			<!-- Lying -->
			<div v-if="room.waitingForPlayerLying">

				<div v-if="!player.lied">
					<LyingPlayer></LyingPlayer>
				</div>

				<div v-else>
					<h1>Várakozás a többi játékos válaszára</h1>
				</div>

			</div>


			<!-- Guessing -->
			<div>
				<div v-if="room.waitingForPlayerGuess">

					<div v-if="!player.guessed">
						<GuessingPlayer></GuessingPlayer>
					</div>

					<div v-else>
						<h1>Várakozás a többi játékos válaszára</h1>
					</div>

				</div>
			</div>

		</div>

		<!-- After everybody finished guessing, you must see the screen for results -->
		<div v-else>
			<h1>Nézd a képernyőt!</h1>

			<button class="button" v-if="room">
				Indulhat a következő kör
			</button>
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
	mounted() {
		this.waitingForFact();
	},
	methods: {
		waitingForFact() {
			this.sockets.subscribe('send_fact_to_client', ({ room, fact }) => {
				console.log('Fact queried successfully', room);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setFact', fact);
			});
		}
	}
};
</script>