<template>
	<div class="switches">
		<ul>
			<li class="switch-item" v-for="(item, index) in switches" :class="{'active':currentIndex === index}" @click="switchItem(index)">
				<span>{{item.name}}</span>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: {
		switches: {
			type: Array,
			default: []
		},
		currentIndex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {

		}
	},
	methods: {
		switchItem(index) {
			this.$emit('switch', index)
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.switches{
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
	ul{
		display: flex;
   		align-items: center;
		.switch-item{
			flex: 1;
			text-align: center;
      		font-size: $font-size-medium;
      		color: $color-text-d;
      		padding: 8px;
      		&.active{
      			background: $color-highlight-background;
        		color: $color-text;
      		}
			span{

			}
		}
	}
}
</style>