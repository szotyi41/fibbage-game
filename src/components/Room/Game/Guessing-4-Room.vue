<template>
	<div class="guessing-component">
		<Countdown :value="countdown" :maxCount="room.playersTimeToGuess"></Countdown>

		<div class="answer" v-for="(answer, answerIndex) in answers" :key="answerIndex">
			{{ answer }}
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
	computed: {
		...mapState('game', ['room', 'answers'])
	},
	data() {
		return {
			countdown: -1
		};
	},
	mounted() {
		this.getChoosableAnswers();

		this.waitingForCountdown();

		this.waitingForGuessedAnswerByAnotherPlayer();

		this.waitingForTimeoutIfSomePlayerNotGuessed();
	},
	methods: {
		// DO NOT CALL THIS BEFORE NEEDED
		getChoosableAnswers() {
			this.$socket.emit('get_guessables_to_server', {}, ({ success, message, room, answers }) => {
				// Failed to get fact
				if (!success) {
					console.log('Failed to get answers to guess', message);
					return;
				}

				console.log('Answers arrived from server', answers);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setAnswers', answers);
				this.countdown = room.playersTimeToGuess;
			});
		},

		waitingForGuessedAnswerByAnotherPlayer() {
			this.sockets.subscribe('send_player_guessed_answer_to_client', ({ success, message, player, room, players }) => {
				if (!success) {
					console.log('Failed to get someone guessed answer', message);
				}

				console.log('Player guessed to room', player.playerName);

				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
			});
		},

		waitingForTimeoutIfSomePlayerNotGuessed() {
			this.sockets.subscribe('send_timeout_to_guess_answers_to_client', ({ room, players }) => {
				console.log(
					'Time is out, players not guessed: ',
					players.filter((player) => !player.guessed).map((player) => player.playerName)
				);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', players);
			});
		},

		waitingForCountdown() {
			this.sockets.subscribe('send_countdown_time_to_client', ({ time, room }) => {
				this.countdown = time;
				this.$store.commit('game/setRoom', room);
			});
		}
	}
};
</script>