<template>
	<div class="game-player-component w-100">



		<Round v-if="room && room.showRound"></Round>

		<CategoryChoosePlayer v-if="room && !room.showRound && !room.category"></CategoryChoosePlayer>

		<DisplayFact v-if="room && !room.showRound && room.category"></DisplayFact>

	</div>
</template>

<script>
import { mapState } from 'vuex';

import Round from './Round-0-Player.vue';
import CategoryChoosePlayer from './CategoryChoose-1-Player.vue';
import DisplayFact from './DisplayFact-2-Player.vue';

export default {
	components: {
		Round,
		CategoryChoosePlayer,
		DisplayFact
	},
	mounted() {
		console.log('haloo');
		console.log('try to connect', 'http://192.168.1.4:3001');
	},
	computed: {
		...mapState('game', ['room', 'player'])
	}
};
</script>