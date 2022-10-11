<template>
	<div class="player-component">

		<div class="flex w-100" v-if="!room?.started">
			<WaitingForPlayersPlayer></WaitingForPlayersPlayer>
		</div>

		<div class="flex w-100" v-if="room?.started">
			<GamePlayer></GamePlayer>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import WaitingForPlayersPlayer from './WaitingForPlayers/WaitingForPlayers-1-Player.vue';
import GamePlayer from './Game/GamePlayer.vue';

export default {
	components: {
		WaitingForPlayersPlayer,
		GamePlayer
	},
	sockets: {
		connect() {
			//this.tryToRejoinRoom();
		},
		disconnect() {
			this.$toast.error('🔴 Socket disconnected');
		}
	},
	computed: {
		...mapState('game', ['room', 'player'])
	},
	mounted() {
		// Dangerous !!!
		this.clearRoom();

		this.waitingForNextRound();
	},
	methods: {
		clearRoom() {
			this.$store.commit('game/clearRoom');
		},
		waitingForNextRound() {
			this.sockets.subscribe('start_next_round_to_client', ({ success, room }) => {
				if (!success) {
					return;
				}

				this.$store.commit('game/setRoom', room);
			});
		},

		tryToRejoinRoom() {
			// If last room not found, do not try to rejoin
			// this.$toast.info(this.player.playerName);

			if (!this.player.id) {
				this.$toast.info('Rejoin not needed');
				return;
			}

			this.$toast.info('Try to rejoin room: ' + this.player.id);

			this.$socket.emit('rejoin_player_to_server', { playerId: this.player.id }, ({ success, message, room, player, players }) => {
				if (!success) {
					this.$store.commit('game/setRoom', {});
					this.$store.commit('game/setPlayer', {});
					this.$store.commit('game/setPlayers', []);
					this.$toast.error(message);
					return;
				}

				console.log('Get from server', room, player, players);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayer', player);
				this.$store.commit('game/setPlayers', players);
				this.$store.commit('game/setCategories', room.categories);
				this.$store.commit('game/setCategory', room.category);
				this.$store.commit('game/setFact', room.fact);
				this.$store.commit('game/setAnswers', room.answers);

				this.$toast.success('✅ Successfully rejoined to room');
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.player-component {
	display: flex;
	width: 100vw;
	font-family: 'Montserrat', sans-serif;
}
</style>