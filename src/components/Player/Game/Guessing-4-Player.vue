<template>
	<div class="guessing-component">

		<Countdown :value="countdown" :maxCount="room.playersTimeToGuess"></Countdown>

		<h1 v-if="isShowDoNotSelectYourAnswer">Ne válaszd a saját válaszod</h1>

		<div class="answers">
			<button v-for="(answer, answerIndex) in answers"
				class="answer answer-player"
				:class="{'your-answer': player.lie === answer}"
				:key="answerIndex"
				:disabled="player.lie === answer"
				@mouseup="sendGuessable(answer)">
				{{ answer }}
			</button>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Countdown from '../../Countdown.vue';

export default {
	components: {
		Countdown
	},
	data() {
		return { countdown: -1, isShowDoNotSelectYourAnswer: false };
	},
	computed: {
		...mapState('game', ['player', 'players', 'room', 'answers'])
	},
	mounted() {
		this.waitingForChoosableAnswers();

		this.waitingForGuessedAnswerByAnotherPlayer();

		this.waitingForTimeoutIfSomePlayerNotGuessed();
	},
	methods: {
		// Other users
		waitingForChoosableAnswers() {
			this.sockets.subscribe('send_choosable_answers_to_client', ({ success, message, room, answers }) => {
				// Failed to get fact
				if (!success) {
					console.log('Failed to get answers to guess', message);
					return;
				}

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setAnswers', answers);
			});
		},
		waitingForGuessedAnswerByAnotherPlayer() {
			this.sockets.subscribe('send_player_guessed_answer_to_client', ({ success, message, room, players }) => {
				if (!success) {
					console.log('Failed to get someone guessed answer', message);
				}

				console.log('Player guessed answer now the players list', players);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
			});
		},

		waitingForTimeoutIfSomePlayerNotGuessed() {
			this.sockets.subscribe('send_timeout_to_guess_answers_to_client', ({ room, players }) => {
				console.log(
					'Time is out, players not guessed: ',
					players.filter((player) => !player.guessed)
				);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
			});
		},

		// On guess an answer
		sendGuessable(answer) {
			if (this.player.lie === answer) {
				this.isShowDoNotSelectYourAnswer = true;
				return;
			}

			console.log('Send guessed answer:', answer);

			this.$socket.emit('send_guessed_answer_to_server', { answer: answer }, ({ success, message, room, player, players }) => {
				// Failed to get fact
				if (!success) {
					console.log('Failed to get answers to guess', message);
					return;
				}

				console.log(player.playerName, 'guessed:', player.guess);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
				this.$store.commit('game/setPlayer', player);
			});
		},
		waitingForCountdown() {
			window.socket.on('send_countdown_time_to_client', ({ time, room }) => {
				this.countdown = time;

				this.$store.commit('game/setRoom', room);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.answers {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;

	.answer {
		background-color: #000;
		color: #fff;
		text-transform: uppercase;
		font-weight: 900;
		padding: 12px 24px;
		margin: 4px 4px;
		font-size: 16px;
		border-radius: 8px;
		border: none;
		transition: all 0.3s;

		&.your-answer {
			opacity: 0.5;
		}

		&:hover {
			cursor: pointer;
			transform: scale(0.95);
		}
	}
}
</style>