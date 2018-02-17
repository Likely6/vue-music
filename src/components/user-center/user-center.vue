<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="returnBack">
				<i class="icon-back"></i>
			</div>
			<div class="switches-wrapper">
				<v-switches :switches="switches" :currentIndex="currentIndex" ref="switches" @switch="switchItem"></v-switches>
			</div>
			<div class="play-btn" @click="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<v-scroll ref="favoritelist" class="list-scroll" v-if="currentIndex===0" :data="favoritelist">
					<div class="list-inner">
						<v-songList :data="favoritelist" @select="selectSong"></v-songList>
					</div>
				</v-scroll>
				<v-scroll ref="playlist" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
					<div class="list-inner">
						<v-songList :data="playHistory" @select="selectSong"></v-songList>
					</div>
				</v-scroll>
			</div>
			<div class="no-result-wrapper" v-show="noResult">
				<v-noResult :title="title"></v-noResult>
			</div>
		</div>
	</transition>
</template>
<script>
import Switches from '../../base/switch/switch'
import Scroll from '../../base/scroll/scroll'
import Song from '../../common/js/song'
import SongList from '../../base/songList/songList'
import NoResult from '../../base/no-result/no-result'
import {playlistMixin} from '../../common/js/mixin'
import {mapGetters, mapActions} from 'vuex'
export default {
	mixins: [playlistMixin],
	data() {
		return {
			switches: [
				{name: '我喜欢的'},
				{name: '最近听的'}
			],
			currentIndex: 0,
			title: ''
		}
	},
	components: {
		'v-switches': Switches,
		'v-scroll': Scroll,
		'v-songList': SongList,
		'v-noResult': NoResult
	},
	computed: {
		noResult() {
			if (this.currentIndex === 0) {
				this.title = '暂无收藏歌曲'
				return !this.favoritelist.length
			} else {
				this.title = '你还未收藏歌曲'
				return !this.playHistory.length
			}
		},
		...mapGetters([
			'favoritelist',
			'playHistory'
		])
	},
	methods: {
		switchItem(index) {
			this.currentIndex = index
		},
		returnBack() {
			this.$router.back()
		},
		selectSong(song) {
			this.insertSong(new Song(song))
		},
		random() {
			let list = this.currentIndex === 0 ? this.favoritelist : this.playHistory
			if (list.length === 0) {
				return
			}
			list = list.map((song) => {
				return new Song(song)
			})
			console.log(list)
			this.randomPlay({list})
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.listWrapper.style.paddingBottom = bottom
			this.$refs.favoritelist && this.$refs.favoritelist.refresh()
			this.$refs.playlist && this.$refs.playlist.refresh()
		},
		...mapActions([
			'insertSong',
			'randomPlay'
		])
	}
}
</script>
<style lang='scss' scoped>
@import '../../common/scss/variable.scss';
.user-center{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background: $color-background;
	.back{
		position: absolute;
		top: 0;
		left: 6px;
		.icon-back{
			display: block;
			padding: 10px;
			margin-top: 5px;
			font-size: $font-size-large-x;
        	color: $color-theme;
		}
	}
	.switches-wrapper{
		margin: 10px 0 30px 0;
	}
	.play-btn{
		width: 135px;
		height: 32px;
		margin: 0 auto;
		box-sizing: border-box;
      	padding: 7px 0;
      	border: 1px solid  $color-text-l;
      	color: $color-text-l;
      	border-radius: 100px;
      	text-align: center;
      	font-size: 0;
      	.icon-play{
      		display: inline-block;
      		margin-right: 6px;
      		font-size: $font-size-medium-x;
      		vertical-align: middle;
      	}
      	.text{
        	display: inline-block;
        	vertical-align: middle;
        	font-size: $font-size-small;
    	}
	}
	.list-wrapper{
		position: absolute;
		top: 110px;
		bottom: 0;
		width: 100%;
	}
	.no-result-wrapper{
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		transform: translate(0,-50%);
	}
}
</style>