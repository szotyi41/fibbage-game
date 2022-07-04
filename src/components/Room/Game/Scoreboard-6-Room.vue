<template>
	<div class="scoreboard-component">
		<div class="scoreboard">
			<transition-group name="scoreboard">
				<div class="scoreboard-player" v-for="(player, playerIndex) in playersOrdered" :key="playerIndex">
					<div class="scoreboard-name">{{ player.name }}</div>
					<div class="scoreboard-score"><ICountUp :delay="1000" :endVal="player.score" :options="counterOptions"></ICountUp></div>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
import ICountUp from 'vue-countup-v2';
import { mapState } from 'vuex';

export default {
	components: {
		ICountUp
	},
	computed: {
		...mapState('game', ['players']),

		playersOrdered() {
			return [...this.players].sort((p1, p2) => (this.isOrderPlayers ? p1.score > p2.score : p1.previous_score > p2.previous_score));
		}
	},
	mounted() {
		setTimeout(() => (this.isOrderPlayers = true), 5000);
	},
	data() {
		return {
			isOrderPlayers: false,
			counterOptions: {
				useEasing: true,
				useGrouping: true,
				separator: ',',
				decimal: '.',
				prefix: '',
				suffix: ''
			}
		};
	}
};
</script>

<style lang="scss" scoped>
.scoreboard {
	display: flex;
	flex-direction: column;
	margin: auto;
	width: 80%;

	.scoreboard-player {
		display: flex;
		justify-content: space-between;
		width: 100%;

		.scoreboard-name {
			text-align: left;
			font-size: 2rem;
		}

		.scoreboard-score {
			text-align: right;
			font-size: 2rem;
		}
	}
}

/* Animation list of players */
.scoreboard-move,
.scoreboard-enter-active,
.scoreboard-leave-active {
	transition: all 0.5s ease;
}

.scoreboard-enter-from,
.scoreboard-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.scoreboard-leave-active {
	position: absolute;
}
</style>