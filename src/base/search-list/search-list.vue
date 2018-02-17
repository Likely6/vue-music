<template>
	<div class="search-list" v-show="searches.length">
		<ul>
			<li class="search-item" v-for="item in searches" @click="selectItem(item)">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOnce(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: {
		searches: {
			type: Array,
			default: []
		}
	},
	methods: {
		selectItem(item) {
			this.$emit('select', item)
		},
		deleteOnce(item) {
			this.$emit('delete', item)
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.search-list{
	ul{
		.search-item{
			display: flex;
			align-items:center;
			height: 40px;
			font-size: $font-size-medium;
			color: $color-text-l;
			.text{
				flex: 1;
			}
			.clear{
				.icon-clear{
					font-size: $font-size-medium;
					color: $color-text-d;
				}
			}
		}
	}
}
</style>