<template>
	<div class="game-room-component">

		<!-- Guess category by a player -->
		<CategoryChooseRoom v-if="!room.category"></CategoryChooseRoom>

		<!-- Display the fact -->
		<DisplayFactRoom v-if="room.category"></DisplayFactRoom>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CategoryChooseRoom from './CategoryChoose-1-Room.vue';
import DisplayFactRoom from './DisplayFact-2-Room.vue';

export default {
	components: {
		CategoryChooseRoom,
		DisplayFactRoom
	},
	computed: {
		...mapState('game', ['room'])
	}
};
</script>