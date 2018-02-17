<template>
	<div class="loading">
		<img class="loadingImg" src="./images/loading.gif" height="100" width="100">
		<p class="desc">{{title}}</p>
	</div>
</template>
<script >
	export default {
		props: {
			title: {
				type: String,
				default: '正在加载中...'
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../common/scss/variable.scss';
	.loading{
		text-align: center;
		.loadingImg{
			width: 30px;
			height: 30px;
			margin-bottom: 6px;
		}
		.desc{
			color: $color-text-d;
			font-size: $font-size-small;
		}
	}
</style>