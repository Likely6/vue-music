<template>
	<transition name="slide">
		<div class="add-song" v-if="showFlag" @click.stop>
			<div class="header">
				<h1 class="title">添加歌曲到列表</h1>
				<div class="close" @click="hide">
					<i class="icon-close"></i>
				</div>
			</div>
			<div class="search-box-wrapper">
				<v-searchBox placeholder="搜索歌曲" @query="queryChange" ref="searchBox"></v-searchBox>
			</div>
			<div class="shortcut" v-show="!query">
				<v-switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></v-switches>
				<div class="list-wrapper">
					<v-scroll v-if="currentIndex === 0" :data="playHistory" ref="scroll">
						<div class="list-linnera">
							<v-songList :data="playHistory" @select="selectSong"></v-songList>
						</div>
					</v-scroll>
					<v-scroll v-else :data="searchHistory">
						<div class="list-linnerb">
							<v-searchList @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></v-searchList>
						</div>
					</v-scroll>
				</div>
			</div>
			<div class="search-result" v-show="query">
				<v-suggest :query="query" :showSinger='false' @select="selectSuggest" @listScroll="blurInput"></v-suggest>
			</div>
			<v-topTip ref='toptip'>
				<div class="tip-title">
					<i class="icon-ok"></i>
					<span class="text">一首歌曲已经添加到播放队列</span>
				</div>
			</v-topTip>
		</div>
	</transition>
</template>
<script>
import SearchBox from '../../base/search-box/search-box'
import Suggest from '../../components/suggest/suggest'
import {searchMixin} from '../../common/js/mixin'
import Switches from '../../base/switch/switch'
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/songList/songList'
import SearchList from '../../base/search-list/search-list'
import {mapGetters, mapActions} from 'vuex'
import Song from '../../common/js/song'
import TopTip from '../../base/top-tip/top-tip'
export default {
	mixins: [searchMixin],
	data() {
		return {
			showFlag: false,
			currentIndex: 0,
			switches: [
				{name: '最近播放'},
				{name: '搜索历史'}
			]
		}
	},
	components: {
		'v-searchBox': SearchBox,
		'v-suggest': Suggest,
		'v-switches': Switches,
		'v-scroll': Scroll,
		'v-songList': SongList,
		'v-searchList': SearchList,
		'v-topTip': TopTip
	},
	computed: {
		...mapGetters([
			'playHistory'
		])
	},
	methods: {
		show() {
			this.showFlag = true
		},
		hide() {
			this.showFlag = false
		},
		switchItem(index) {
			this.currentIndex = index
		},
		selectSuggest() {
			this.saveSearch()
			this.showTip()
		},
		selectSong(song, index) {
			if (index !== 0) {
				this.insertSong(new Song(song))
				this.showTip()
			}
		},
		showTip() {
			this.$refs.toptip.show()
		},
		...mapActions([
			'insertSong'
		])
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.add-song{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	z-index: 201;
	background: $color-background;
	&.slide-enter-active, &.slide-leave-active{
      transition: all 0.3s;
	}
    &.slide-enter, &.slide-leave-to{
      transform: translate3d(100%, 0, 0);
    }
    .header{
    	position: relative;
    	text-align: center;
    	height: 44px;
    	.title{
    		line-height: 44px;
    		font-size: $font-size-large;
    		color: $color-text;
    	}
    	.close{
    		position: absolute;
    		top: 0;
    		right: 8px;
			.icon-close{
				display: block;
				padding: 12px;
				font-size: 20px;
				color: $color-theme;
			}
    	}
    }
    .search-box-wrapper{
    	margin: 20px;
    }
    .shortcut{
    	position: fixed;
		top: 124px;
		bottom: 0;
		width: 100%;
		.list-wrapper{
			height: calc(100% - 32px);
			.list-linnerb{
				padding: 20px 30px;
			}
		}
    }
    .search-result{
		position: fixed;
		top: 124px;
		bottom: 0;
		width: 100%;
	}
	.tip-title{
		text-align: center;
		padding: 18px 0;
		i{
			margin-right: 14px;
			font-size: 14px;
			color: #ffcd32;
		}
		.text{
			font-size: 14px;
			color: #fff;
		}
	}
}
</style>