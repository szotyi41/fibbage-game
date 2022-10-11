<template>
	<div class="scoreboard-component">

		<div class="scoreboard">

			<transition-group name="list">

				<div class="scoreboard-player" 
					:class="{'show': isShowPlayers[playerIndex]}"
					:style="{backgroundColor: player.color}" 
					v-for="(player, playerIndex) in playersWithComments" 
					:key="playerIndex">

					<div class="scoreboard-name">{{ player.playerName }}</div>

					<div>
						<div class="scoreboard-comment">{{ player.comment }}</div>
						<div class="scoreboard-score" v-if="isOrderPlayers[playerIndex]">

							<!-- <span class="plus green">
								+ {{ player.score - player.previousScore }}
							</span> -->

							<count-up :start-val="player.previousScore" 
								:end-val="player.score" 
								:duration="3" 
								:autoplay="true">
							</count-up>


						</div>
						<div class="scoreboard-score" v-else>

							<count-up :start-val="player.previousScore" 
								:end-val="player.previousScore" 
								:autoplay="true">
							</count-up>

						</div>
					</div>
				</div>

			</transition-group>

			<h1 v-if="room.canGoToNextQuestion == true">Mehet a következő kör?</h1>
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
		...mapState('game', ['players', 'room']),

		playersOrdered() {
			return [...this.players].sort((p1, p2) => (this.isOrderAllPlayers ? p1.score > p2.score : p1.previousScore > p2.previousScore));
		},
		playersWithComments() {
			const stats = this.playersOrdered.reduce(
				(result, player, _, { length }) => {
					return {
						// Average score
						average: result.average + player.score / length,

						// Max score
						max: player.score > result.max ? player.score : result.max
					};
				},
				{ average: 0, max: 0 }
			);

			return this.playersOrdered.map((player) => {
				// First players
				if (stats.max > 0 && player.score === stats.max) {
					return { ...player, comment: this.randomFromArray(this.firstComments) };
				}

				// Emerging score
				if (player.score > player.previousScore + 1500) {
					return { ...player, comment: this.randomFromArray(this.emergingComments) };
				}

				// Under average score
				if (player.score < stats.average) {
					return { ...player, comment: this.randomFromArray(this.underAverageComments) };
				}

				// Above average
				if (player.score > stats.average) {
					return { ...player, comment: this.randomFromArray(this.aboveAverageComments) };
				}

				return { ...player, comment: this.randomFromArray(this.sameScoreComments) };
			});
		}
	},
	mounted() {
		const startCounting = 3000;
		this.isShowPlayers = [];
		this.isOrderPlayers = [];

		// Each in players to create array of falses
		this.players.forEach((player, playerIndex) => {
			const wait = playerIndex * 1000;

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

		// Show in correct order,
		const untilAllPlayersCounted = this.players.length * 500 + 3000;
		setTimeout(() => {
			console.log('Show in correct order');
			this.isOrderAllPlayers = true;
		}, startCounting + untilAllPlayersCounted + 1000);

		// After show scores send the other users can go to next question
		setTimeout(() => {
			this.$socket.emit('show_can_go_to_next_round_button_to_server', {}, ({ success, room }) => {
				if (!success) {
					return;
				}

				this.$store.commit('game/setRoom', room);
			});
		}, startCounting + untilAllPlayersCounted + 2000);
	},
	data() {
		return {
			isOrderPlayers: [],
			isOrderAllPlayers: false,
			isShowPlayers: [],
			firstComments: [
				'Elsőkből legyenek az utolsók',
				'Szerintem nem neked kellene vezetni',
				'Találkozunk a célvonalban',
				'Fentről szép az élet'
			],
			emergingComments: [
				'Mint a talajvíz',
				'Mindjárt az első helyen',
				'Mehetett volna szarabbul is, de most jól sikerült',
				'Micsoda sprint',
				'Angyalporba mártott'
			],
			underAverageComments: [
				'Átlagfelettien átlagalatti',
				'Húzd meg kicsit',
				'Munkanélküli',
				'Ülj le egyes',
				'Elege van belőle, kérlek ne nevessétek ki',
				'Csak vége lesz már'
			],
			aboveAverageComments: [
				'Megfelelt',
				'Nem is rossz',
				'Bukás már nem lesz',
				'Feljebb is lehetne a helyed',
				' Cowabunga',
				'Csak még egy szintet feljebb'
			],
			sameScoreComments: ['Valamit csak el kellene érni']
		};
	},
	methods: {
		randomFromArray(a) {
			return a[Math.floor(Math.random() * a.length)];
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
	background: rgba(0, 0, 0, 0.5);
	padding-top: 64px;
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
</style>