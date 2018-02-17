<template>
	<div class="rank" ref="rank">
		<v-scroll class="toplist" :data="topListData" ref="toplist">
			<ul>
				<li @click="selectItem(item,index)" class="item" v-for="(item, index) in topListData">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl">
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song, index) in item.songList">
							<span>{{index + 1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!topListData.length">
				<v-loading></v-loading>
			</div>
		</v-scroll>
		<router-view></router-view>
	</div>
</template>
<script>
import {getTopList} from '../../api/rank'
import {ERR_OK} from '../../api/config'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'
export default {
	mixins: [playlistMixin],
	data() {
		return {
			topListData: []
		}
	},
	components: {
		'v-scroll': Scroll,
		'v-loading': Loading
	},
	methods: {
		_getTopList() {
			getTopList().then((res) => {
				if (res.code === ERR_OK) {
					this.topListData = res.data.topList
				}
			})
		},
		selectItem(item, index) {
			this.$router.push({
				path: `/rank/${item.id}`
			})
			this.setToplist(item)
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.rank.style.paddingBottom = bottom
			this.$refs.toplist.refresh()
		},
		...mapMutations({
			'setToplist': 'SET_TOP_LIST'
		})
	},
	created() {
		this._getTopList()
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/mixin.scss';
.rank{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
	.toplist{
		height: 100%;
		overflow: hidden;
		.item{
			display: flex;
			margin: 0 20px;
			padding-top: 20px;
			height: 100px;
			box-sizing: content-box;
			&:last-child{
				padding-bottom: 20px;
			}
			.icon{
				flex: 0 0 100px;
				width: 100px;
				height: 100px;
			}
			.songlist{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 20px;
				height: 100px;
				overflow: hidden;
				background: $color-highlight-background;
				color: $color-text-d;
				font-size: $font-size-small;
				.song{
					@include nowrap;
					line-height: 26px;
				}
			}
		}
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>