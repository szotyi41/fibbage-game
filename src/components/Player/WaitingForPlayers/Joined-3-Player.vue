<template>
	<div class="joined-player-component">
		<h1 class="player-name w-100" @click="$store.dispatch('game/getRoom', $socket)">
			Szia, <span class="underline">{{ player.playerName }}</span>!
		</h1>

		<!-- {{ room?.started }} -->
		<div class="error-message">{{ errorMessage }}</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['player'])
	},
	data() {
		return {
			errorMessage: ''
		};
	}
};
</script>

