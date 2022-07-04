<template>
	<div className="countdown">
		<div className="countdown-line" :style="{ width: ((value / maxCount) * 100) + '%' }"></div>
	</div>
</template>

<script>
export default {
	props: {
		value: Number,
		maxCount: Number
	}
};
</script>

<style lang="scss" scoped>
@import '../style/variables.scss';

.countdown {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 24px;

	.countdown-line {
		position: absolute;
		background-color: green;
		height: 24px;
		left: 0;
		top: 0;
		transition: $transition-bounce;
	}
}
</style>