<template>
	<div class="scoreboard-component" :class="{'vignette': isVideoEnded}">

		<div class="video-container">
			<video ref="video" class="video" muted src="final.mp4" @ended="onVideoEnd()" alt=""></video>
		</div>

		<div class="scoreboard" v-if="isVideoEnded">

			<h1>Eredménytábla</h1>

			<transition-group name="list">

				<div class="scoreboard-player" 
					:class="{'show': isShowPlayers[playerIndex]}"
					:style="{backgroundColor: player.color}" 
					v-for="(player, playerIndex) in playersOrderedByScore" 
					:key="playerIndex">

					<div class="scoreboard-name"><span class="index">#{{playerIndex + 1}}</span> {{ player.playerName }}</div>

					<div>
						<div class="scoreboard-comment">{{ player.comment }}</div>

						<div class="scoreboard-score">

							<count-up :start-val="0" 
								:end-val="player.score" 
								:autoplay="true">
							</count-up>

						</div>
					</div>
				</div>

			</transition-group>

		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CountUp from 'vue-countup-v3';

export default {
	components: {
		CountUp
	},
	computed: {
		//hal
		...mapState('game', ['players', 'room']),

		playersOrderedByScore() {
			return [...this.players].sort((p1, p2) => p1.score > p2.score);
		}
	},

	mounted() {
		this.startAnimations();

		this.$refs.video.autoplay = true;
		this.$refs.video.load();
	},
	data() {
		return {
			isVideoEnded: false,
			isOrderPlayers: [],
			isOrderAllPlayers: false,
			isShowPlayers: []
		};
	},
	methods: {
		startAnimations() {
			const startCounting = 3000;
			this.isShowPlayers = [];
			this.isOrderPlayers = [];

			// Each in players to create array of falses
			this.players.forEach((player, playerIndex) => {
				const wait = (this.players.length - playerIndex) * 1000;

				this.isOrderPlayers.push(false);
				this.isShowPlayers.push(false);

				setTimeout(() => {
					this.isShowPlayers[playerIndex] = true;
					this.$forceUpdate();
				}, wait);

				setTimeout(() => {
					this.isOrderPlayers[playerIndex] = true;
					this.$forceUpdate();
				}, startCounting + Math.min(wait, 0.1) / 2);
			});

			setTimeout(() => {});
		},
		onVideoEnd() {
			this.isVideoEnded = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.scoreboard-component {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
}

.video-container {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;

	.video {
		position: fixed;
		left: 0;
		top: 0;
		min-width: 100vw;
	}
}

.vignette {
	background: rgba(0, 0, 0, 0.5);
	box-shadow: inset 0 0 5em 1em #000;
}

.plus {
	font-size: 22px;
	-webkit-text-stroke-width: 1px;
	-webkit-text-stroke-color: white;
	margin-right: 8px;
}

.scoreboard {
	display: flex;
	flex-direction: column;
	width: 75vw;
	margin: auto;
	padding-top: 64px;

	.scoreboard-player {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 8px 0;
		border-radius: 8px;
		padding: 18px 24px;

		opacity: 0;
		transform: translateX(-32px);

		&.show {
			opacity: 1;
			transform: translateX(0);
		}

		.scoreboard-name {
			text-align: left;
			font-size: 2rem;
			color: #fff;
			font-weight: bold;
		}

		.scoreboard-comment {
			color: #f2f0c9;
			font-size: 1.1rem;
			font-weight: bold;
			text-align: right;
		}

		.scoreboard-score {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			text-align: right;
			font-size: 2rem;
			color: #fff;
			font-weight: bold;
		}
	}
}

h1 {
	z-index: 1000;
}

/* Animation list of players */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
	position: absolute;
}

.index {
	font-size: 36px;
	margin-right: 32px;
}
</style>