<template>
	<div class="game-player-component">
		<CategoryChoosePlayer v-if="!room.category"></CategoryChoosePlayer>

		<DisplayFact v-if="room.category"></DisplayFact>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CategoryChoosePlayer from './CategoryChoose-1-Player.vue';
import DisplayFact from './DisplayFact-2-Player.vue';

export default {
	components: {
		CategoryChoosePlayer,
		DisplayFact
	},
	computed: {
		...mapState('game', ['room', 'player'])
	}
};
</script>