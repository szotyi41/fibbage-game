<template>
	<div class="waiting-for-players-component w-100">

		<div class="room-code-section">

			<div class="room-code-logo">
				<img src="assets/logo.png" alt="" />
			</div>

			<h2>A telefonodon menj a <b>{{ playerPage }}</b> oldalra és írd be a képernyőn látható szobakulcsot.</h2>

			<h1>Szobakulcs a csatlakozáshoz</h1>

			<div class="room-code animate__animated animate__pulse animate__infinite animate__delay-2s">
				<div class="room-code-animation">
					<span v-if="room?.roomCode">{{ room.roomCode }}</span>
					<i v-else class="loading-spinner"></i>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import { mapState } from 'vuex';
import 'animate.css';

export default {
	computed: {
		...mapState('game', ['room'])
	},
	data() {
		return {
			playerPage: 'http://localhost:8080/player'
		};
	},
	mounted() {
		this.waitingForStartGame();
		this.createRoom();
	},
	methods: {
		waitingForStartGame() {
			console.log('Waiting for someone press start the game...');

			// Waiting for start the game by player
			this.sockets.subscribe('game_started_to_client', ({ success, message, room, player }) => {
				// Failed to start the game
				if (!success) {
					console.log('Start the game', message);
					return;
				}

				// Player is started the game
				console.log('Player', player.playerName, 'is started the game', room.id);
				this.$store.commit('game/setRoom', room);
			});

			// Update player details (name, profile image)
			this.sockets.subscribe('player_has_updated_details_to_client', ({ success, message, room }) => {
				// Failed to update player details
				if (!success) {
					console.log('Start the game', message);
					return;
				}

				this.$store.commit('game/setRoom', room);
			});
		},
		createRoom() {
			console.log('Create new room...');
			this.$socket.emit('create_game_room_to_server', {}, ({ success, room, message }) => {
				if (!success) {
					console.log('Failed to create room', message);
					return;
				}

				this.$store.commit('game/setRoom', room);
				console.log('Room created successfully', room.id);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.waiting-for-players-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 70vw;
	height: 50vh;
	margin: auto;
	font-family: $font-family;

	h1,
	h2 {
		text-align: center;

		b {
			color: $color-prm;
		}
	}

	.room-code-section {
		align-items: center;
		justify-content: center;
		margin: auto;
		width: 70%;
	}

	/* Logo */
	.room-code-logo {
		display: flex;
		justify-content: center;
		width: 100%;
		margin: auto;

		transform: rotate(4deg) scale(1.4);

		img {
			height: 100%;
			max-height: 250px;
		}
	}

	.room-code-animation {
		display: flex;
	}

	.room-code {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		padding: 32px 48px;
		color: $color-prm;
		-webkit-text-fill-color: $color-prm;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: black;
		max-width: 300px;
		font-weight: 900;
		margin: auto;
		font-size: 64px;
		text-align: center;

		/* Spinner */
		.room-code-spinner {
			color: $color-prm;
			font-size: 12px;
			margin: 20px auto;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			position: relative;
			text-indent: -9999em;
			-webkit-animation: load4 1.3s infinite linear;
			animation: load4 1.3s infinite linear;
			-webkit-transform: translateZ(0);
			-ms-transform: translateZ(0);
			transform: translateZ(0);
		}
	}
}
</style>