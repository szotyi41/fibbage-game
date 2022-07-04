<template>
	<div class="lying-player-component">
		<Countdown :value="countdown" :maxCount="room.playersTimeToLie"></Countdown>

		<!-- Type your answer -->
		<input type="text"
			class="input"
			v-model="lie"
			:disabled="isSendingLie"
			placeholder="Írd be a szerinted legjobb hazugságot"
		/>

		<!-- Send your answer -->
		<button class="button button-prm"
			:disabled="!lie.length || isSendingLie"
			@click="sendLie()">
			Hazudok
		</button>
	</div>
</template>

<script>
import { mapState } from 'vuex';
0;
import Countdown from '../../Countdown.vue';

export default {
	components: {
		Countdown
	},
	computed: {
		...mapState('game', ['room'])
	},
	data() {
		return {
			lie: '',
			isSendingLie: false,
			countdown: -1
		};
	},
	mounted() {
		this.waitingForCountdown();
	},
	methods: {
		sendLie() {
			console.log('Start to send lie', this.lie);

			this.isSendingLie = true;
			this.$socket.emit('send_player_lie_to_server', { lie: this.lie }, ({ success, room, players, player }) => {
				this.isSendingLie = false;

				// Failed to send your answer
				if (!success) {
					console.log('Failed to send your lie');
					return;
				}

				if (player.lied && player.lie && player.lie.length) {
					console.log('Player lied successfully', player.lie);
				}

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
				this.$store.commit('game/setPlayer', player);
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