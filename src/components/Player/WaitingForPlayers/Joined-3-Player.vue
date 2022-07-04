<template>
	<div class="joined-player-component">
		<div class="player-name">Szia, {{ player.playerName }}!</div>
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