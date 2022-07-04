<template>
	<div class="results-component">

		<div class="cards">

			<div class="card blue" v-for="(answer, answerIndex) in showAnswersInOrder" :key="answerIndex">
				<div>{{ answer.answerText }} {{ answer.showOrderIndex }}</div>

				<div class="card-player-choosed-small" 
					v-for="(player, playerIndex) in answer.playersGuessed" 
					:key="playerIndex">
					{{ player.playerName }}
					<span class="card-player-choosed-small-score">+ 500</span>
				</div>
			</div>

		</div>


		<div class="card card-on-screen" 
			v-if="currentAnswer.answerText" 
			:class="{'increase-to-center': animationIndex >= 1}">

			<!-- Answer Text -->
			<div class="card-answer-text">{{ currentAnswer.answerText }}</div>

			<!-- Lied by player -->
			<div class="card-answer-lied" 
				:class="{'increase-to-center': animationIndex >= 4}" 
				v-if="currentAnswer.liedByPlayer?.playerName">
				{{ currentAnswer.liedByPlayer.playerName }} írta
			</div>

			<!-- Lie -->
			<div class="card-answer-lie" 
				:class="{'increase-to-center': animationIndex >= 4}" 
				v-else-if="!currentAnswer.isCorrectAnswer">
				Hamis
			</div>

			<!-- Truth -->
			<div class="card-answer-truth" 
				:class="{'increase-to-center': animationIndex >= 4}" 
				v-else-if="currentAnswer.isCorrectAnswer">
				Igaz
			</div>



			<!-- Show who choosed -->
			<div class="card-players-choosed">
				<div class="card-player-choosed-large" 
					:class="{'increase-to-center': animationIndex >= 2}"
					v-for="(player, playerIndex) in currentAnswer.playersGuessed" 
					:key="playerIndex">

					<!-- Name -->
					<div class="card-player-choosed-name">{{ player.playerName }}</div>

					<!-- Score -->
					<span class="card-player-choosed-small-score" 
						:class="{'increase-to-center': animationIndex >= 3}">
						+ 500
					</span>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['players' /* 'answers', 'fact' */]),

		fact() {
			return {
				_id: '6057b3d33233a7a7d70dc64d',
				fact: 'Az őskorban nem volt jellemző _-ra/-re vadászni.',
				info: 'A mamutvadászat egyáltalán nem volt jellemző az őskorszakban élt emberekre, mivel nem volt elég fejlett fegyverzetük ahhoz, hogy leterítsenek egy ilyen hatalmas állatot. Így ők inkább csak a már elpusztult mamutokat keresték, a húsuk, a bőrük és a csontjuk felhasználása céljából.',
				category: 'Őskor',
				recommended: ['kardfogú tigrisek', 'hüllők', 'tehenek', 'disznók', 'csirkék', 'emlősök'],
				correct: 'mamutok'
			};
		},

		answers() {
			return ['kardfogú tigrisek', 'hüllők', 'tehenek', 'disznók', 'csirkék', 'emlősök', 'mamutok'];
		},

		showAnswersInOrder() {
			let showOrderIndex = 0;

			return (
				this.answers

					// SHOW ANSWERS BY LIED
					.map((answer) => {
						// Find players who guessed this answer
						const playersGuessed = [{ id: 1, playerName: 'péter', guessed: 'emlősök' }]; //this.players.filter((player) => player.guess === answer);

						const isGuessedByPlayer = playersGuessed.length ? true : false;
						const isCorrectAnswer = this.fact.correct === answer;

						// Has guessed by player
						if (isGuessedByPlayer) {
							showOrderIndex++;
						}

						return {
							answerText: answer,
							/* color: playersGuessed?.[0].color, */
							liedByPlayer: { id: 2, playerName: 'zoli' },
							playersGuessed: playersGuessed,
							isCorrectAnswer: isCorrectAnswer,
							isGuessedByPlayer: isGuessedByPlayer,
							showOrderIndex: isGuessedByPlayer ? showOrderIndex : 100
						};
					})

					// SHOW CORRECT ANSWER LAST
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
			return [...this.showAnswersInOrder].sort((a, b) => a.showOrderIndex - b.showOrderIndex);
		}
	},
	data() {
		return {
			animationIndex: 0,
			currentAnswer: {}
		};
	},
	mounted() {
		this.startAnimations();
	},
	methods: {
		async startAnimations() {
			this.currentAnswer = this.answersSorted[0];
			console.log('started with ', this.answersSorted);
			this.animationIndex = 0;
			await this.wait(1000);
			this.animationIndex = 1;
			await this.wait(1000);
			this.animationIndex = 2;
			await this.wait(1000);
			this.animationIndex = 3;
			await this.wait(1000);
			this.animationIndex = 4;
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

	&.blue {
		background: darken($blue, 40%);
		.card-player-choosed-small {
			color: darken($blue, 15%);
		}
	}
	&.red {
		background: darken($red, 40%);
		.card-player-choosed-small {
			color: darken($red, 15%);
		}
	}
	&.green {
		background: darken($green, 40%);
		.card-player-choosed-small {
			color: darken($green, 15%);
		}
	}
	&.yellow {
		background: darken($yellow, 40%);
		.card-player-choosed-small {
			color: darken($yellow, 15%);
		}
	}

	.card-player-choosed-small {
		color: darken($blue, 15%);
		font-size: 0.9rem;

		.card-player-choosed-small-score {
			color: darken($blue, 15%);
			font-size: 0.7rem;
		}
	}
}

.card-on-screen {
	position: absolute;
	left: 50vw;
	top: 50vh;
	transform: scale(0) translate(-50%, -50%);
	opacity: 0;
	transition: $transition-bounce;

	font-size: 6rem;
	padding: 2.8rem;

	&.increase-to-center {
		transform: scale(1) translate(-50%, -50%);
		opacity: 1;
	}

	.card-answer-lied {
		font-size: 0rem;
		opacity: 0;
		transition: $transition-bounce;

		&.increase-to-center {
			font-size: 4rem;
			color: $blue;
			opacity: 1;
		}
	}

	.card-players-choosed {
		position: absolute;
		left: 0;
		bottom: 2rem;
		width: 100%;
		display: flex;
		justify-content: center;

		.card-player-choosed-large {
			position: relative;
			background: darken($blue, 30%);
			border: 6px solid #000;
			padding: 0.6rem;
			font-size: 0.5rem;
			border-radius: 12px;
			transform: scale(0) rotate(-2deg) translateY(100%);
			opacity: 0;
			transition: $transition-bounce;

			font-size: 2.2rem;
			padding: 1.8rem;

			&.increase-to-center {
				transform: scale(1) rotate(-2deg) translateY(100%);
				opacity: 1;
			}

			.card-player-choosed-small-score {
				display: flex;
				transition: $transition-bounce;
				color: darken($blue, 15%);
				font-size: 0rem;

				&.increase-to-center {
					font-size: 1.5rem;
				}
			}
		}
	}
}
</style>