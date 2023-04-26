<template>
	<div class="display-fact-component">


		<transition name="show-fact">
			<h1 class="fact-text" 
				:class="{'waiting-for-lying': room.waitingForPlayerLying}" 
				v-if="fact.fact"
				v-html="fact.fact"></h1>
		</transition>


		<div v-if="!room.showResultsAfterEverybodyGuessed">

			<!-- Lying -->
			<div v-if="room.waitingForPlayerLying">
				<LyingRoom></LyingRoom>
			</div>

			<!-- Guessing -->
			<div v-else>
				<GuessingRoom></GuessingRoom>
			</div>

		</div>

		<!-- Show results -->
		<div v-else>
			<ResultsRoom></ResultsRoom>
		</div>

	</div>
</template>

<script>
import { mapState } from 'vuex';
import LyingRoom from './Lying-3-Room.vue';
import GuessingRoom from './Guessing-4-Room.vue';
import ResultsRoom from './Results-5-Room.vue';

export default {
	components: {
		LyingRoom,
		GuessingRoom,
		ResultsRoom
	},
	computed: {
		...mapState('game', ['room', 'fact'])
	},
	mounted() {
		this.getFact();
	},
	methods: {
		getFact() {
			const category = this.room.category;
			console.log('Start query fact by category', this.room.category);
			this.$socket.emit('get_fact_to_server', { category: category }, ({ success, message, room, fact }) => {
				// Failed to get fact
				if (!success) {
					console.log('Failed to get fact', message);
					return;
				}

				// Fact queried successfully
				console.log('Fact queried successfully', fact);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setFact', fact);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.display-fact-component {
	overflow: hidden;
	position: relative;
	width: 100vw;
	height: 100vh;
}

.fact-text {
	font-size: 48px;
	transition: $transition-bounce;
	margin-top: 64px;

	&.waiting-for-lying {
		font-size: 80px;
		margin-top: 128px;
	}
}
</style>