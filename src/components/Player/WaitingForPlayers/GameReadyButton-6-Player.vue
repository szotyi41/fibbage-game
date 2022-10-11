<template>
	<div class="game-ready-button-component">

		<!-- I am ready button -->
		<div>
			
			<div class="player-is-ready-section">

				<button v-if="!player.ready"
					class="button button-prm start-game"
					@click="sendPlayerIsReady(true)"
					:disabled="isSendingPlayerIsReady">
					<span>Felőlem indulhat</span>
				</button>

				<button v-if="player.ready"
					class="button button-sec start-game"
					style="margin-bottom: 8px"
					@click="sendPlayerIsReady(false)"
					:disabled="isSendingPlayerIsReady">
					<span>Várjunk még egy kicsit</span>
				</button>

			</div>

		</div>

		<!-- Game start button -->
		<div>
			<div v-if="room.everybodyReady" class="everybody-in-section">
				<button class="button button-prm"
					@click="sendEverybodyIn()"
					:disabled="isSendingEverybodyIn">
					<span>Mindenki kész</span>
				</button>
			</div>

			<div v-if="!room.everybodyReady" class="everybody-in-section">
				<span>
					{{ notReadyPlayers.length }} játékos még nem áll készen
				</span>
			</div>
		</div>

		<div class="error-message">{{ errorMessage }}</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['player', 'players', 'room']),

		notReadyPlayers() {
			return this.players.filter((player) => player.ready !== true);
		}
	},
	data() {
		return {
			isSendingEverybodyIn: false,
			isSendingPlayerIsReady: false,
			errorMessage: ''
		};
	},
	methods: {
		sendPlayerIsReady(ready) {
			console.log('Start send player is ready: ', ready);

			this.isSendingPlayerIsReady = true;
			this.$socket.emit(
				'player_is_ready_to_server',
				{
					ready: ready
				},
				({ success, message, room, player }) => {
					this.isSendingPlayerIsReady = false;

					// Failed to set player status to ready
					if (!success) {
						this.errorMessage = message;
						console.log('Failed to set ready status: ', message);
						return;
					}

					// Player is ready for the game
					console.log('Player is ready for the game', player);
					this.errorMessage = '';
					this.$store.commit('game/setRoom', room);
					this.$store.commit('game/setPlayer', player);
					this.$store.commit('game/setPlayers', room.players);
				}
			);
		},
		sendEverybodyIn() {
			console.log('Start send everybody in for room', this.room);

			this.isSendingEverybodyIn = true;
			this.$socket.emit('start_game_to_server', {}, ({ success, message, room, player }) => {
				this.isSendingEverybodyIn = false;

				// Failed to send start game
				if (!success) {
					this.errorMessage = message;
					console.log('Failed to set everybody in: ', message);
					return;
				}

				// Start game successfully
				console.log('You started the game', room.id);
				this.errorMessage = '';
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayer', player);
				this.$store.commit('game/setPlayers', room.players);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.everybody-in-section {
	color: #fff;
	margin-top: 8px;
}
</style>