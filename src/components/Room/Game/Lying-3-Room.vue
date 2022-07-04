<template>
	<div class="lying-component">
		<Countdown :value="countdown" :maxCount="room.playersTimeToLie"></Countdown>

		<div>
			Kész vagytok: {{ playersWhosAlreadyLied }}
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
			return this.players.filter((player) => player.lied === true).map((player) => player.name);
		}
	},
	mounted() {
		this.waitingForCountdown();

		this.waitingForPlayersLied();
	},
	methods: {
		waitingForPlayersLied() {
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
