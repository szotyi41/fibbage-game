<template>
	<div class="ask-name-player-component">
		<div class="enter-player-name">

			<h1>Írd be a neved:</h1>

			<input type="text"
				class="input"
				v-model="playerName"
				placeholder="Írd be a neved"/>

			<div class="error-message">{{ errorMessage }}</div>

			<!-- Loading spinner or send player name button -->
			<button v-if="isPlayerJoining" class="button button-prm" disabled>
				<i class="loading-spinner"></i>
			</button>

			<div v-else class="buttons">
				<button class="button button-sec" @click="getRandomPlayerName()">
					Sorsolj egy nevet
				</button>

				<button class="button button-prm" @click="sendPlayerName(playerName)" :disabled="!playerName.length">
					Indulhat
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import randomPlayerNames from '../../../store/randomPlayerNames.json';

export default {
	data() {
		return {
			playerName: '',
			errorMessage: '',
			isPlayerJoining: false
		};
	},
	methods: {
		getRandomPlayerName() {
			const playerName = randomPlayerNames[Math.round(Math.random() * randomPlayerNames.length)];
			this.playerName = playerName;
		},
		sendPlayerName(playerName) {
			console.log('Send player name to server: ', playerName);
			this.isPlayerJoining = true;
			this.$socket.emit(
				'send_player_name_to_server',
				{
					playerName: playerName
				},
				({ success, message, room, player }) => {
					this.isPlayerJoining = false;

					// Failed to set player name
					if (!success) {
						this.errorMessage = message;
						console.log('Failed to connect player', message);
						return;
					}

					// Player successfully joined to room
					console.log('Player is connected', player);
					this.$store.commit('game/setPlayer', player);
					this.errorMessage = '';

					// If you already joined to room, rejoin
					if (typeof room !== 'undefined') {
						this.$store.commit('game/setRoom', room);
					}
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.ask-name-player-component {
	width: 70vw;
	margin: auto;

	@media screen and (max-width: 800px) {
		width: 90vw;
	}

	.enter-player-name {
		display: flex;
		flex-direction: column;
		max-width: 80vw;
		margin: auto;
	}
}
</style>