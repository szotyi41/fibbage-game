<template>
	<div class="lying-component">
		<Countdown :value="countdown" :maxCount="room.playersTimeToLie"></Countdown>

		<!-- List hows already lied -->
		<div class="players-joined">
			<transition-group name="players-joined-list">
				<div class="player-joined"
					v-for="(player, playerIndex) in playersWhosAlreadyLied"
					:key="playerIndex"
					:style="{backgroundColor: player.color}">
					<div class="player-name">{{ player.playerName }} hazudott</div>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Countdown from '../../Countdown.vue';

export default {
	components: {
		Countdown
	},
	data() {
		return {
			countdown: 0
		};
	},
	computed: {
		...mapState('game', ['room', 'players']),

		playersWhosAlreadyLied() {
			/* return [
				{ playerName: 'Alma', color: 'red' },
				{ playerName: 'Szilva', color: 'green' },
				{ playerName: 'Körte', color: 'blue' }
			];  */

			return this.players.filter((player) => player.lied === true);
		}
	},
	mounted() {
		this.waitingForCountdown();

		this.waitingForOtherPlayersLying();
	},
	methods: {
		waitingForOtherPlayersLying() {
			this.sockets.subscribe('on_player_sent_lie_to_client', ({ success, room, players }) => {
				// Failed to get fact
				if (!success) {
					console.log('Failed to get the answer from player');
					return;
				}

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
			});
		},

		waitingForCountdown() {
			this.sockets.subscribe('send_countdown_time_to_client', ({ time, room }) => {
				this.countdown = time;
				this.$store.commit('game/setRoom', room);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.players-joined {
	position: absolute;
	left: 50%;
	bottom: 32px;
	transform: translateX(-50%);
	display: flex;
	transition: all 0.5s ease;

	.player-joined {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333;
		padding: 6px 12px;
		margin: 0 8px;
		font-family: 'Montserrat', sans-serif;
		font-weight: bold;
		border-radius: 12px;
		margin-bottom: 12px;
		text-transform: uppercase;
		transition: all 0.5s ease;
		border: none;

		&:nth-child(1n) {
			transform: rotate(-1deg);
		}
		&:nth-child(2n) {
			transform: rotate(-4deg);
		}
		&:nth-child(3n) {
			transform: rotate(2deg);
		}
		&:nth-child(4n) {
			transform: rotate(-5deg);
		}
		&:nth-child(5n) {
			transform: rotate(-6deg);
		}
		&:nth-child(6n) {
			transform: rotate(6deg);
		}

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
	}
}

.players-joined-list-enter-active,
.players-joined-list-leave-active {
	transition: all 0.5s ease;
}
.players-joined-list-enter-from,
.players-joined-list-leave-to {
	opacity: 0;
	transform: translateY(60px);
}
</style>