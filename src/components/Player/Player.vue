<template>
	<div class="player-component">

		<div class="flex" v-if="!room.started">
			<WaitingForPlayersPlayer></WaitingForPlayersPlayer>
		</div>

		<div class="flex" v-if="room.started">
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
			console.log('Connected');
			this.tryToRejoinRoom();
		},
		disconnect() {
			console.log('Disconnected');
			this.clearRoom();
		}
	},
	computed: {
		...mapState('game', ['room'])
	},
	mounted() {
		this.clearRoom();
	},
	methods: {
		clearRoom() {
			this.$store.commit('game/clearRoom');
		},
		tryToRejoinRoom() {
			// If last room not found, do not try to rejoin
			if (!this.$store.state.game.playerForRejoin?.id) {
				console.log('Rejoin not needed');
				return;
			}

			console.log('Try to rejoin', this.$store.state.game.playerForRejoin?.id);

			this.$store.commit('game/setRoom', {});
			this.$store.commit('game/setPlayer', {});
			this.$store.commit('game/setPlayers', []);

			this.$socket.emit(
				'rejoin_player_to_server',
				{ lastKnownPlayer: this.$store.state.game.playerForRejoin },
				({ success, message, room, player, players }) => {
					if (!success) {
						alert(message);
						return;
					}

					console.log('Get from server', room, player, players);

					this.$store.commit('game/setRoom', room);
					this.$store.commit('game/setPlayer', player);
					this.$store.commit('game/setPlayers', players);
				}
			);
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