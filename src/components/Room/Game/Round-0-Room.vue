<template>
	<transition name="fade" v-if="isShowAnyting">
		<div class="round-component">
			<h1 class="animate__animated animate__fadeInLeft" v-show="isShowRound">{{ room.round === 10 ? 'Utolsó' : room.round }}. forduló</h1>

			<h2 class="animate__animated animate__fadeInUp red" v-show="isShowGuessedLie">{{ room.guessedLieScore }} pont minden ravasz játékosnak</h2>
			<h2 class="animate__animated animate__fadeInUp green" v-show="isShowTruthScore">{{ room.guessedTruthScore }} pont minden okos játékosnak</h2>
		</div>
	</transition>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room'])
	},
	data() {
		return {
			isShowRound: false,
			isShowGuessedLie: false,
			isShowTruthScore: false,
			isShowAnyting: true
		};
	},
	mounted() {
		this.isShowRound = false;
		this.isShowGuessedLie = false;
		this.isShowTruthScore = false;
		setTimeout(() => (this.isShowRound = true), 1000);
		setTimeout(() => (this.isShowGuessedLie = true), 3000);
		setTimeout(() => (this.isShowTruthScore = true), 4500);
		setTimeout(() => (this.isShowAnyting = false), 6000);
		setTimeout(() => this.getCategories(), 6500);
	},
	methods: {
		getCategories() {
			console.log('Get random categories');
			this.$socket.emit('get_categories_to_server', {}, ({ success, message, room }) => {
				// Failed to get categories
				if (!success) {
					console.log('Failed to get categories: ', message);
					return;
				}

				// Categories successfully queried
				console.log('Categories queried successfully', room.categories);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setCategories', room.categories);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.round-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	box-shadow: inset 0 0 5em 1em #000;
	transition: all 0.3s;

	h1 {
		color: #fff;
		margin-bottom: 64px;
		font-size: 6rem;
		transition: all 0.3s;
	}

	h2 {
		margin-bottom: 8px;
		margin-top: 8px;
		transition: all 0.3s;
	}
}
</style>