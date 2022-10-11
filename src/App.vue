<template>
	<router-view/>
</template>

<script>
export default {
	/* sockets: {
		connect() {
			this.$toast.success('✅ Socket connected');
		},
		disconnect() {
			this.$toast.error('🔴 Socket disconnected');
		}
	} */
};
</script>

<style lang="scss">
@import '~animate.css/animate.css';

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
