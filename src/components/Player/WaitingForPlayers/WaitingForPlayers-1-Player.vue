<template>
	<div class="waiting-for-players-component w-100">

		<div class="left-content w-100">
			<!-- Player name not known, ask the user -->
			<AskNamePlayer v-if="!player?.playerName"></AskNamePlayer>

			<!-- We know player name -->
			<JoinedPlayer v-if="player?.playerName"></JoinedPlayer>

			<!-- But we dont know room code yet -->
			<AskRoomCodePlayer v-if="player?.playerName && !room?.roomCode"></AskRoomCodePlayer>

			<!-- Game ready button -->
			<GameReadyButtonPlayer v-if="player?.playerName && room?.roomCode"></GameReadyButtonPlayer>
		</div>

		<div class="right-content">

			<!-- We know player name and room code -->
			<JoinedPlayersList v-if="player.playerName && room.roomCode"></JoinedPlayersList>

		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import AskNamePlayer from './AskName-2-Player.vue';
import JoinedPlayer from './Joined-3-Player.vue';
import AskRoomCodePlayer from './AskRoomCode-4-Player.vue';
import JoinedPlayersList from './JoinedPlayersList-5-Player.vue';
import GameReadyButtonPlayer from './GameReadyButton-6-Player.vue';

export default {
	components: {
		AskNamePlayer,
		JoinedPlayer,
		AskRoomCodePlayer,
		JoinedPlayersList,
		GameReadyButtonPlayer
	},
	computed: {
		...mapState('game', ['room', 'player'])
	},
	mounted() {},
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
				this.$store.commit('game/setPlayers', room.players);
			});

			// Update player details (name, profile image)
			this.sockets.subscribe('player_has_updated_details_to_client', ({ success, message, room }) => {
				// Failed to update player details
				if (!success) {
					console.log('Start the game', message);
					return;
				}

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.waiting-for-players-component {
	display: flex;
	justify-content: space-between;
	width: 100vw;

	.left-content {
		display: flex;
		flex-direction: column;
	}
}
</style>