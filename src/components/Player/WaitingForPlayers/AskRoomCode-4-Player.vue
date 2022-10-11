<template>
	<div class="ask-room-code-component">
		<h1>Írd be a szobakódot, hogy társaiddal egy játékba kerüljetek: </h1>

		<input type="text"
			class="input"
			v-model="roomCode"
			placeholder="Írd be a szobakódot"
		/>

		<!-- Error message -->
		<span class="error-message">{{ errorMessage }}</span>

		<!-- Loading spinner until joining to room -->
		<button v-if="isJoiningGameRoom" class="button button-prm" disabled="true">
			<i class="loading-spinner"></i>
		</button>

		<button v-else 
			class="button button-prm"
			@click="joinToRoom(roomCode)"
			:disabled="!roomCode.length">
			Mehet
		</button>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room', 'player'])
	},
	data() {
		return { roomCode: 'code', isJoiningGameRoom: false, errorMessage: '' };
	},
	methods: {
		joinToRoom(roomCode) {
			console.log('Try to join room: ', roomCode);
			this.isJoiningGameRoom = true;
			this.$socket.emit(
				'player_join_to_room_to_server',
				{
					roomCode: roomCode
				},
				({ success, message, room, player }) => {
					this.isJoiningGameRoom = false;

					// Failed to join room
					if (!success) {
						this.errorMessage = message;
						this.$store.commit('game/setPlayer', player);
						console.log('Failed to join room', message);
						return;
					}

					// Player successfully joined
					console.log(player.playerName, 'is successfully joined to room', room.id);
					this.errorMessage = '';
					this.$store.commit('game/setRoom', room);
					this.$store.commit('game/setPlayer', player);
					this.$store.commit('game/setPlayers', room.players);
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.enter-room-code-section {
	width: 70%;
	margin: auto;

	@media screen and (max-width: 800px) {
		width: 90%;
	}

	.already-joined-players-section {
		width: 100%;
	}
}
</style>