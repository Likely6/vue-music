<template>
	<div class="songList">
		<ul class="list_panel">
			<li @click="selectItem(item,index)" class="list_once" v-for="(item,index) in data">
				<div class="rank" v-show="rank">
					<span :class="getRankCls(index)">{{getRankText(index)}}</span>
				</div>
				<div class="list_once_panel">
					<h5 class="list_name">{{item.name}}</h5>
					<h6 class="list_singer">{{item.singer+'·'+item.album}}</h6>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import {getSongUrlData} from '../../api/song.js'
	import {ERR_OK} from '../../api/config.js'
	import {mapMutations} from 'vuex'
	export default {
		props: {
			data: {
				type: Array,
				default() {
					return []
				}
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			selectItem(item, index) {
				getSongUrlData(item.mid).then((res) => {
					if (res.code === ERR_OK) {
						const url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
						this.setSongUrl(url)
						this.$nextTick(() => {
							this.$emit('select', item, index)
						})
					}
				})
			},
			getRankCls(index) {
				if (index <= 2) {
					return `icon icon${index}`
				} else {
					return `text`
				}
			},
			getRankText(index) {
				if (index > 2) {
					return index + 1
				}
			},
			...mapMutations({
				'setSongUrl': 'SET_SONG_URL'
			})
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../common/scss/variable.scss';
	@import '../../common/scss/mixin.scss';
	.songList{
		box-sizing: content-box;
		.list_panel{
			padding: 20px 30px;
			box-sizing: content-box;
			.list_once{
				height: 64px;
				display: flex;
				align-items:center;
				.rank{
					flex: 0 0 25px;
					width: 25px;
					margin-right: 30px;
					text-align: center;
					.icon{
						display: inline-block;
						width: 25px;
						height: 24px;
						background-size: 25px 24px;
						&.icon0{
							@include bg-image('images/first');
						}
						&.icon1{
							@include bg-image('images/second');
						}
						&.icon2{
							@include bg-image('images/third');
						}
					}
					.text{
						color: $color-theme;
						font-size: $font-size-large;
					}
				}
				.list_once_panel{
					.list_name{
						font-size: $font-size-medium;
						color: $color-text;
						line-height: 1.4em;
						margin-bottom: 4px;
					}
					.list_singer{
						font-size: $font-size-medium;
						color: $color-text-d;
						line-height: 1.4em;
					}
				}
			}
		}
	}
</style>