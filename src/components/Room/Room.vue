<template>
	<div class="room-component">

		<div class="flex w-100" v-if="!room.started">
			<WaitingForPlayersRoom></WaitingForPlayersRoom>
			<PlayersJoinedRoom></PlayersJoinedRoom>
		</div>

		<div class="flex w-100" v-if="room.started">
			<GameRoom></GameRoom>
		</div>

		<div @click="toggleAudio()" class="toggle-audio">
			<img :src="'assets/' + (isMuted ? 'mute' : 'unmute') + '.svg'" alt="">
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

			// Dangerous !!!
			this.clearRoom();
		}
	},
	data() {
		return {
			isMuted: true,
			audio: { paused: true },
			musicList: ['music1.mp3', 'music2.mp3', 'music3.mp3']
		};
	},
	mounted() {
		// Dangerous !!!
		this.clearRoom();

		this.audio = new Audio(this.musicList[Math.round(Math.random() * this.musicList.length)]);
	},
	methods: {
		toggleAudio() {
			if (this.audio.paused) {
				this.isMuted = false;
				this.audio.play();
			} else {
				this.isMuted = true;
				this.audio.pause();
				this.audio = new Audio(this.musicList[Math.round(Math.random() * this.musicList.length)]);
			}
		},
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
						console.error(message);
						return;
					}

					this.$store.commit('game/setRoom', room);
					this.$store.commit('game/setPlayers', players);
				}
			);
		}
	},
	beforeUnmount() {
		this.audio.pause();
		delete this.audio;
	}
};
</script>

<style lang="scss" scoped>
.toggle-audio {
	position: fixed;
	left: 32px;
	top: 32px;
	width: 48px;
	height: 48px;
	transition: all 0.3s;

	&:hover {
		cursor: pointer;
		transform: scale(1.3) rotate(-6deg);
	}

	img {
		width: 100%;
	}
}
.room-component {
	display: flex;
	width: 100vw;
	font-family: 'Montserrat', sans-serif;
}
</style>