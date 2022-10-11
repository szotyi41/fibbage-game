<template>
	<div class="players-joined-component">
		<div class="players-joined">


			<div class="players-will-show-here">
				<span v-if="!players?.length">A csatlakozott játékosok itt fognak megjelenni.</span>
				<span v-else>Csatlakozott játékosok:</span>
			</div>

			<transition-group name="list">
				<div class="player-joined" 
					:style="{backgroundColor: player.color}" 
					v-for="(player, playerIndex) in players" :key="playerIndex">

					<!-- Profile -->
					<!-- <div class="player-profile">
						<img :src="player.profileImage" alt="" />
					</div>  -->

					<!-- Player is ready -->
					<div v-if="player.ready" class="player-is-ready">
						<span>😎</span>
					</div>

					<!-- Player is not ready -->
					<div v-if="!player.ready" class="player-is-ready">
						<span>😡</span>
					</div>

					<!-- Player name -->
					<div class="player-name">{{ player.playerName }}</div>


				</div>
			</transition-group>
		</div>
	</div>
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
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.players-joined-component {
	display: flex;
	flex-direction: column;
	width: 30vw;
	height: 100vh;

	/* background-image: url('/assets/ripped-vertical.svg'); */
	background-repeat: no-repeat;
	background-size: cover;

	.players-joined {
		display: flex;
		flex-direction: column;
		padding-top: 32px;
		margin-right: 32px;

		.players-will-show-here {
			font-size: 26px;
			margin-bottom: 32px;
			transition: $transition-bounce;
			color: #fff;
			font-family: 'Montserrat', sans-serif;
			text-align: center;
			font-weight: bold;
			margin-left: 1vw;
		}

		.player-joined {
			display: flex;
			justify-content: center;
			align-items: center;
			/* transform: rotate(4deg); */
			color: #333;
			/* background-color: $color-blue-light; */
			padding: 6px 12px;
			font-family: 'Montserrat', sans-serif;
			font-weight: bold;
			/* border-top: 4px solid #333; */

			border-radius: 12px;
			margin-bottom: 12px;
			text-transform: uppercase;
			/* border-radius: 12px; */
			/* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */
			border: none;

			.player-profile {
				overflow: hidden;
				width: 48px;
				height: 48px;
				font-family: 'Montserrat', sans-serif;
				color: #000;

				img {
					border: none;
					width: 100%;
				}
			}

			.player-name {
				font-size: 32px;
				font-family: 'Montserrat', sans-serif;
				font-weight: bold;
				color: #fff;
			}

			.player-is-ready {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				span {
					font-size: 48px;
				}

				i {
					font-size: 48px;
				}
			}
		}
	}
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>