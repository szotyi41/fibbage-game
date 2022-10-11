<template>
	<div class="game-room-component">

		<transition name="fade">
			<RoundRoom class="absolute" v-if="room.showRound"></RoundRoom>
		</transition>

		<!-- Guess category by a player -->
		<transition name="fade">
			<CategoryChooseRoom class="absolute" v-if="!room.showRound && !room.category"></CategoryChooseRoom>
		</transition>

		<!-- Display the fact -->
		<transition name="fade">
			<DisplayFactRoom class="absolute" v-if="!room.showRound && room.category"></DisplayFactRoom>
		</transition>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import RoundRoom from './Round-0-Room.vue';
import CategoryChooseRoom from './CategoryChoose-1-Room.vue';
import DisplayFactRoom from './DisplayFact-2-Room.vue';

export default {
	components: {
		RoundRoom,
		CategoryChooseRoom,
		DisplayFactRoom
	},
	computed: {
		...mapState('game', ['room'])
	},
	mounted() {
		this.waitingForNextRound();

		this.waitingForSomeoneDisconnected();
	},
	methods: {
		waitingForNextRound() {
			this.sockets.subscribe('start_next_round_to_client', ({ success, room }) => {
				if (!success) {
					return;
				}

				this.$store.commit('game/setRoom', room);
			});
		},
		waitingForSomeoneDisconnected() {
			this.sockets.subscribe('send_someone_disconnected_to_client', ({ player }) => {
				console.log('disconnected someone', player);

				if (player) {
					this.$toast.error('🔴 ' + player.playerName + ' is disconnected');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.game-room-component {
	width: 100%;
}
</style>