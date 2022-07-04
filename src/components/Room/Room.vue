<template>
	<div class="room-component">

		<div class="flex" v-if="!room.started">
			<WaitingForPlayersRoom></WaitingForPlayersRoom>
			<PlayersJoinedRoom></PlayersJoinedRoom>
		</div>

		<div class="flex" v-if="room.started">
			<GameRoom></GameRoom>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import WaitingForPlayersRoom from './WaitingForPlayers/WaitingForPlayersRoom.vue';
import PlayersJoinedRoom from './WaitingForPlayers/PlayersJoinedRoom.vue';
import GameRoom from './Game/GameRoom.vue';

export default {
	components: {
		WaitingForPlayersRoom,
		PlayersJoinedRoom,
		GameRoom
	},
	computed: {
		...mapState('game', ['room'])
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
	mounted() {
		this.clearRoom();
	},
	methods: {
		clearRoom() {
			this.$store.commit('game/clearRoom');
		},
		tryToRejoinRoom() {
			// If last room not found, do not try to rejoin
			if (!this.$store.state.game.roomForRejoin?.id) {
				console.log('Rejoin not needed');
				return;
			}

			console.log('Try to rejoin', this.$store.state.game.roomForRejoin?.roomCode);

			this.$store.commit('game/setRoom', {});
			this.$store.commit('game/setPlayers', []);

			this.$socket.emit(
				'rejoin_room_to_server',
				{ lastKnownRoom: this.$store.state.game.roomForRejoin },
				({ success, message, room, players }) => {
					if (!success) {
						alert(message);
						return;
					}

					this.$store.commit('game/setRoom', room);
					this.$store.commit('game/setPlayers', players);
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.room-component {
	display: flex;
	width: 100vw;
	font-family: 'Montserrat', sans-serif;
}
</style>