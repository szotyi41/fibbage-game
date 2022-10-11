<template>
	<div class="results-component">

		<div v-if="!isShowScoreboard">

			<!-- Show answer cards -->
			<transition name="fade">
				<div class="cards" v-if="animationIndex < 1 || animationIndex > 5">
					<div class="card small" v-for="(answer, answerIndex) in showAnswersInOrder" :key="answerIndex">
						<div>{{ answer.answerText }}</div>

						<div class="card-players-who-choosed-small">
							<div class="card-player-choosed-small" 
								v-for="(player, playerIndex) in answer?.playersGuessed" 
								:key="playerIndex"
								:style="{backgroundColor: player.color, transform: 'rotate(' + answer.random + 'deg)'}">
								{{ player.playerName }}
							</div>
						</div>
					</div>
				</div>
			</transition>



			<!-- Each on answers -->
			<div class="card card-on-screen" 
				v-if="currentAnswer?.answerText" 
				:class="{'increase-to-center': animationIndex >= 1 && animationIndex < 6}">

				<!-- Answer Text -->
				<div class="card-answer-text">{{ currentAnswer?.answerText }}</div>

				<!-- Lied by player -->
				<div class="card-answer-lied" 
					:class="{'increase-to-center': animationIndex > 3}" 
					v-if="currentAnswer?.liedByPlayer?.playerName">
					{{ currentAnswer?.liedByPlayer?.playerName }} írta
				</div>

				<!-- Lie by computer -->
				<div class="card-answer-lie" 
					:class="{'increase-to-center': animationIndex > 3}" 
					v-if="!currentAnswer?.liedByPlayer?.playerName && !currentAnswer?.isCorrectAnswer">
					Hamis
				</div>

				<!-- Truth -->
				<div class="card-answer-truth" 
					:class="{'increase-to-center': animationIndex > 3}" 
					v-if="!currentAnswer?.liedByPlayer?.playerName && currentAnswer?.isCorrectAnswer">
					Igaz
				</div>



				<!-- Show who choosed (small card) -->
				<div class="card-players-choosed">
					<div class="card-player-choosed-large" 
						:style="{backgroundColor: player.color, transform: 'rotate(' + currentAnswer.random + 'deg)'}"
						:class="{'increase-to-center': animationIndex >= 2}"
						v-for="(player, playerIndex) in currentAnswer.playersGuessed" 
						:key="playerIndex">

						<!-- Name -->
						<div class="card-player-choosed-name">{{ player?.playerName }}</div>

						<!-- Score -->
						<span class="card-player-choosed-small-score" 
							:class="{
								'increase-to-center': animationIndex > 2, 
								'green': currentAnswer?.isCorrectAnswer, 
								'red': animationIndex >= 5 && !currentAnswer?.isCorrectAnswer
							}"
							v-html="currentAnswer?.isCorrectAnswer ? 
								'<span style=\'white-space: nowrap\'>+' + room.guessedTruthScore + '</span>' :
								(currentAnswer?.liedByPlayer) ? 
									'<span style=\'white-space: nowrap\'>+' + (room.guessedLieScore) + '</span>' : 
									''">
						</span>
					</div>
				</div>

			</div>
		</div>


		<transition name="fade">
			<Scoreboard v-if="isShowScoreboard && room.round < 10"></Scoreboard>
		</transition>

		<transition name="fade">
			<FinalScoreboard v-if="isShowScoreboard && room.round >= 10"></FinalScoreboard>
		</transition>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Scoreboard from './Scoreboard-6-Room.vue';
import FinalScoreboard from './FinalScoreboard-7-Room.vue';

export default {
	components: {
		Scoreboard,
		FinalScoreboard
	},
	computed: {
		...mapState('game', ['players', 'answers', 'fact', 'room']),

		showAnswersInOrder() {
			let showOrderIndex = 0;

			return (
				this.answers

					// Show answers lied
					.map((answer) => {
						// Find the player who written this lie
						const liedByPlayer = this.players.find((player) => player.lie === answer);

						// Find players who guessed this answer
						const playersGuessed = this.players.filter((player) => player.guess === answer);

						// Guessed by any player
						const isGuessedByPlayer = playersGuessed.length ? true : false;

						// This is the correct answer
						const isCorrectAnswer = this.fact.correct === answer;

						// Has guessed by any player,
						if (isGuessedByPlayer) {
							showOrderIndex++;
						}

						return {
							answerText: answer,
							random: Math.round(Math.random(4)) - 8,
							liedByPlayer: liedByPlayer,
							playersGuessed: playersGuessed,
							isCorrectAnswer: isCorrectAnswer,
							isGuessedByPlayer: isGuessedByPlayer,
							showOrderIndex: isGuessedByPlayer ? showOrderIndex : 100
						};
					})

					// Show correct answers list,
					.map((answer) => {
						if (answer.isCorrectAnswer) {
							showOrderIndex++;
							return { ...answer, showOrderIndex: showOrderIndex };
						}

						return answer;
					})
			);
		},
		answersSorted() {
			return [...this.showAnswersInOrder]
				.filter((answer) => {
					return answer.isCorrectAnswer || answer.isGuessedByPlayer;
				})
				.sort((a, b) => {
					return a.showOrderIndex - b.showOrderIndex;
				});
		}
	},
	data() {
		return {
			animationIndex: 0,
			animationParts: ['increase-to-center', 'show-whom-choosed', 'show-score', 'truth-or-lie', 'show-who-lied'],

			currentAnswerIndex: 0,
			currentAnswer: {},

			isShowScoreboard: false
		};
	},
	mounted() {
		this.startAnimations();
		this.waitingForCanGoToNextRoundButton();
	},
	methods: {
		waitingForCanGoToNextRoundButton() {
			this.sockets.subscribe('show_can_go_to_next_round_button_to_client', ({ room }) => {
				this.$store.commit('game/setRoom', room);
			});
		},
		async startAnimations() {
			console.log('started with ', this.answersSorted);

			// Wait before start results
			await this.wait(2000);

			for (let answerIndex = 0; answerIndex < this.answersSorted.length; answerIndex++) {
				this.currentAnswerIndex = answerIndex;
				this.currentAnswer = this.answersSorted[answerIndex];

				// Increase to screen center
				this.animationIndex = 0;
				await this.wait(1000);

				// Show whom choosed
				this.animationIndex = 1;
				await this.wait(1000);

				// Show score
				this.animationIndex = 2;
				await this.wait(1000);

				// Truth or lie
				this.animationIndex = 3;
				await this.wait(1000);

				// Show who lied
				this.animationIndex = 4;
				await this.wait(1000);

				// Show score
				this.animationIndex = 5;
				await this.wait(2000);

				// Hide
				this.animationIndex = 6;
				await this.wait(2000);
			}

			// After results, show scoreboard,
			this.isShowScoreboard = true;
		},
		async wait(ms) {
			return new Promise((r) => setTimeout(r, ms));
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.cards {
	display: flex;
	flex-wrap: wrap;
	margin: auto;
	justify-content: center;
}

.card {
	text-align: center;
	display: flex;
	flex-direction: column;
	position: relative;
	border-radius: 12px;
	background: #000;
	/* background: darken($blue, 40%); */
	border: 6px solid #000;
	padding: 1rem;
	font-size: 1.4rem;
	margin: 0.4rem;
	font-weight: 600;
	color: #fff;
	font-family: 'Montserrat', sans-serif;
	text-transform: uppercase;

	&.small {
		margin: 24px 8px;
	}

	.card-players-who-choosed-small {
		display: flex;
		justify-content: center;
		bottom: -32px;
		position: absolute;
		left: 50%;
		font-family: 'Montserrat', sans-serif;
		transform: translateX(-50%);

		.card-player-choosed-small {
			position: relative;
			border-radius: 8px;
			border: 4px solid #000;
			font-family: 'Montserrat', sans-serif;
			font-size: 0.8rem;
			padding: 4px 8px;
			color: #000;
			z-index: 10;
			margin: 0 2px;
		}
	}

	.card-player-choosed-small {
		font-size: 0.9rem;

		.card-player-choosed-small-score {
			font-size: 0.5rem;

			-webkit-text-stroke-width: 2px;
			-webkit-text-stroke-color: white;
		}
	}
}

.card-answer-truth {
	/* background-image: url('assets/truth.png'); */
}

.card-answer-truth,
.card-answer-lie {
	color: #f2f0c9;
	opacity: 0;
}

.card-on-screen {
	position: absolute;
	left: 50vw;
	top: 50vh;
	transform: scale(0.5) translate(-50%, -50%);
	opacity: 0;
	transition: $transition-bounce;
	z-index: 1000;
	font-size: 6rem;
	padding: 2.8rem;

	&.increase-to-center {
		transform: scale(1) translate(-50%, -50%);
		opacity: 1;
	}

	.card-answer-lied,
	.card-answer-lie,
	.card-answer-truth {
		font-size: 0rem;
		opacity: 0;
		transition: $transition-bounce;

		&.increase-to-center {
			font-size: 4rem;
			color: $blue;
			opacity: 1;
		}
	}

	/* Players group */
	.card-players-choosed {
		position: absolute;
		left: 0;
		bottom: -64px;
		width: 100%;
		display: flex;
		justify-content: center;

		/* One player */
		.card-player-choosed-large {
			position: relative;
			background: darken($blue, 30%);
			border: 6px solid #000;
			padding: 3px 8px;
			font-size: 12px;
			border-radius: 12px;
			transform: scale(0) rotate(-1deg) translateY(100%);
			opacity: 0;
			transition: $transition-bounce;
			margin: 0 8px;
			font-size: 2.2rem;
			padding: 1.8rem;

			&.increase-to-center {
				transform: scale(1) rotate(-2deg) translateY(100%);
				opacity: 1;
			}

			.card-player-choosed-small-score {
				display: flex;
				transition: $transition-bounce;
				font-size: 0rem;
				opacity: 0;
				transition: $transition-bounce;
				position: absolute;
				transform: rotate(-2deg);
				-webkit-text-stroke-width: 1px;
				-webkit-text-stroke-color: #000;
				z-index: 1000;

				&.increase-to-center {
					transform: scale(1) rotate(-2deg) translateY(100%);
					opacity: 1;
				}

				&.red {
					color: #a45e5c !important;
				}

				&.green {
					color: #6d9e70 !important;
				}

				&.increase-to-center {
					font-size: 1.5rem;
				}
			}
		}
	}
}
</style>