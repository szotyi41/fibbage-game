<template>
	<div></div>

	<!-- <div class="joined-players-list-component">
		<div class="players-joined">
			<h2 class="players-joined-label">Az alábbi léhűtőkhöz kerültél</h2>

			<div class="player-joined" :style="{backgroundColor: player.color}" v-for="(player, playerIndex) in room?.players" :key="playerIndex">

				<div class="player-name">
					<span>{{ player.playerName }} </span>
					<span v-if="player.ready">✅</span> 
					<span v-else>❎</span>
				</div>

			</div>
		</div>
	</div> -->
</template>


<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room', 'player', 'players'])
	},
	mounted() {
		this.waitingForPlayersToJoin();
		this.waitingWhosReady();
		this.waitingGameIsStarted();
	},
	methods: {
		waitingForPlayersToJoin() {
			console.log('Waiting for players to join...');

			// Waiting for joining players
			this.sockets.subscribe('player_joined_to_room_to_client', ({ success, message, room, player }) => {
				// Failed to join player
				if (!success) {
					console.log('Failed to update room when player joining', message);
					return;
				}

				// Player is joined, update the room
				console.log('Player', player.playerName, 'joined to room', room.id);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
			});
		},
		waitingWhosReady() {
			// Waiting for players press to ready button
			this.sockets.subscribe('player_is_ready_to_client', ({ success, message, room, player }) => {
				// Failed to set ready player
				if (!success) {
					console.log('Failed to update room when player is ready', message);
					return;
				}

				// Player is ready
				console.log('Player', player.playerName, 'is ready in', room.id);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
			});
		},
		waitingGameIsStarted() {
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
				this.$store.commit('game/setPlayers', room.players);
			});
		}
	}
};
</script>


<style lang="scss" scoped>
@import './../../../style/variables.scss';

.joined-players-list-component {
	display: flex;
	flex-direction: column;
	width: 30vw;
	height: 100vh;

	background-image: url('/assets/ripped-vertical.svg');
	background-repeat: no-repeat;
	background-size: cover;

	.players-joined {
		display: flex;
		flex-direction: column;
		padding-top: 32px;

		.players-joined-label {
			color: #333;
		}

		.players-will-show-here {
			font-size: 24px;
			transition: $transition-bounce;
			color: #333;
			font-family: 'Montserrat', sans-serif;
			text-align: center;
			font-weight: bold;
			margin-left: 14px;
		}

		.player-joined {
			display: flex;
			justify-content: space-between;
			align-items: center;
			/* transform: rotate(4deg); */
			color: #333;
			border: none;
			/* background-color: $color-blue-light; */
			padding: 24px 32px;
			font-family: 'Montserrat', sans-serif;
			font-weight: bold;
			border-radius: 12px;
			/* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */

			.player-profile {
				overflow: hidden;
				width: 48px;
				height: 48px;
				font-family: 'Montserrat', sans-serif;

				img {
					border: none;
					width: 100%;
				}
			}

			.player-name {
				font-size: 28px;
				font-family: 'Montserrat', sans-serif;
				font-weight: bold;
				color: #333;
			}

			.player-is-ready {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				span {
					margin-top: 12px;
				}

				i {
					font-size: 22px;
				}

				.fa-times {
					color: $color-red-light;
				}

				.fa-check {
					color: $color-green-light;
				}
			}
		}
	}
}
</style>