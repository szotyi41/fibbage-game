<template>
	<div class="category-guess-component">
		<!-- Category is selected -->
		<div v-if="room?.category?.length" class="animate__animated animate__fadeInLeft">
			<h1>{{ room?.playerWhoHaveToGuessCategory?.playerName + ' a(z) ' + room?.category + ' kategóriát választotta' }}</h1>
		</div>

		<!-- Category not selected yet -->
		<div v-if="!room.category">
			<div>
				<!-- Show player name who guess category -->
				<h1>{{ room.playerWhoHaveToGuessCategory?.playerName + ' választ kategóriát' }}</h1>

				<!-- List of categories -->
				<div className="guess-categories">
					<!-- <div className="category" v-for="(category, categoryIndex) in categories" :key="categoryIndex">
						{{ category }}
					</div> -->
					<canvas class="category-animation-canvas" id="canvas"></canvas>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('game', ['room', 'players', 'categories'])
	},
	mounted() {
		// When room categories component mounted, get categories
		this.startFlyingWords();

		this.waitingForGuessCategory();

		this.waitingForSomeoneGuessedACategory();
	},
	methods: {
		waitingForGuessCategory() {
			console.log('Waiting for guess category...');
			this.sockets.subscribe('waiting_for_guess_category_to_client', ({ success, message, room, categories }) => {
				// Failed to get categories, which can a player could guess
				if (!success) {
					console.log('Failed to get categories', message);
					return;
				}

				// Get player choosable categories
				console.log('Categories show', room.categories);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
				this.$store.commit('game/setCategories', categories);
			});
		},
		waitingForSomeoneGuessedACategory() {
			// On a player guess category
			console.log('Waiting for the user guess category...');
			this.sockets.subscribe('on_guess_category_to_client', ({ success, message, room, category }) => {
				// Error on guess category
				if (!success) {
					console.log('Failed on player guess category', message);
					return;
				}

				// Category successfully guessed by a player, show in screen
				console.log('Category guessed by player', category);
				this.$store.commit('game/setRoom', room);
				this.$store.commit('game/setPlayers', room.players);
				this.$store.commit('game/setCategory', category);
			});
		},
		startFlyingWords() {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var keys_down = [],
				letters = [];

			const ks = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80];
			const symbols = this.categories.map((category, categoryIndex) => ({
				k: ks[categoryIndex],
				s: category,
				x: Math.round(Math.random() * 100)
			}));

			function Letter(key) {
				this.x = findX(key);
				this.symbol = findS(key);
				this.color = 'rgba(255, 255, 255, ' + Math.random() + ')';
				this.size = Math.floor(Math.random() * 40 + 12);
				this.path = getRandomPath(this.x);
				this.rotate = Math.floor(Math.random() * Math.PI + 1);
				this.percent = 0;
			}

			Letter.prototype.draw = function () {
				var percent = this.percent / 100;
				var xy = getQuadraticBezierXYatPercent(this.path[0], this.path[1], this.path[2], percent);
				ctx.save();
				ctx.translate(xy.x, xy.y);
				ctx.rotate(this.rotate);
				ctx.font = 'bold ' + this.size + 'px Montserrat';
				ctx.fillStyle = this.color;
				ctx.fillText(this.symbol, -15, -15);
				ctx.restore();
			};

			Letter.prototype.drawPath = function () {
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(this.path[0].x, this.path[0].y);
				ctx.quadraticCurveTo(this.path[1].x, this.path[1].y, this.path[2].x, this.path[2].y);
				ctx.stroke();
			};

			function findX(key) {
				for (var i = 0; i < symbols.length; i++) {
					if (symbols[i].k == key) {
						return (symbols[i].x * canvas.width) / 100;
					}
				}
				return false;
			}

			function findS(key) {
				for (var i = 0; i < symbols.length; i++) {
					if (symbols[i].k == key) {
						return symbols[i].s;
					}
				}
				return false;
			}

			function getRandomPath(x) {
				var x_start = x;
				var x_end = x_start + Math.floor(Math.random() * 400 - 199);

				return [
					{
						x: x_start,
						y: canvas.height
					},
					{
						x: (x_start + x_end) / 2,
						y: Math.floor(Math.random() * canvas.height - canvas.height)
					},
					{
						x: x_end,
						y: canvas.height
					}
				];
			}

			function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
				var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
				var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
				return { x: x, y: y };
			}

			function resize() {
				var box = canvas.getBoundingClientRect();
				canvas.width = box.width;
				canvas.height = box.height;
			}

			function draw() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (let i = 0; i < letters.length; i++) {
					letters[i].percent += 1;
					letters[i].draw();
					// letters[i].drawPath();
					if (letters[i].percent > 100) {
						letters.splice(i, 1);
					}
				}

				for (var i = 0; i < keys_down.length; i++) {
					if (keys_down[i]) {
						letters.push(new Letter(i));
					}
				}
				requestAnimationFrame(draw);
			}
			var start_keys = ks.slice(0, this.categories.length);

			function startAnimation() {
				setTimeout(function () {
					var key = start_keys.pop();
					keys_down[key] = true;
					setTimeout(function () {
						keys_down[key] = false;
					}, 50);
					if (start_keys.length > 0) {
						startAnimation();
					}
				}, 100);
			}

			resize();
			draw();

			window.animationInterval = setInterval(
				() => {
					if (start_keys.length <= 0) {
						start_keys = ks.slice(0, this.categories.length); //words to show
						startAnimation();
					}
				},
				3000,
				startAnimation()
			);

			// Resize screen
			window.onresize = resize;

			window.requestAnimationFrame = (function () {
				return (
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						window.setTimeout(callback, 1000 / 60);
					}
				);
			})();
		}
	},
	unmounted() {
		if (typeof window.animationInterval !== 'undefined') {
			clearInterval(window.animationInterval);
		}
	}
};
</script>

<style lang="scss" scoped>
.category-animation-canvas {
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
}

.category-guess-component {
	width: 100%;
}
</style>