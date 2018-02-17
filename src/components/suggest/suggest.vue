<template>
	<div class="suggest">
		<v-scroll :data="result" class="suggestWrapper" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll()" ref="suggest">
			<ul class="suggest-list">
				<li class="suggest-item" v-for="(item, index) in result" @click="selectItem(item)">
					<div class="icon">
						<i :class="getIconCls(item)"></i>
					</div>
					<div class="name">
						<p class="text" v-html="getDisplayName(item)"></p>
					</div>
				</li>
				<v-loading v-show="hasMore" title=""></v-loading>
			</ul>
		</v-scroll>
		<div class="no-result-wrapper" v-show="result.length==0 && !hasMore">
			<v-noResult :title="title"></v-noResult>
		</div>
	</div>
</template>
<script>
import {search} from '../../api/search'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'
import Singer from '../../common/js/singer'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import NoResult from '../../base/no-result/no-result'
import {mapMutations, mapActions} from 'vuex'
const perpage = 20
export default {
	props: {
		query: {
			type: String,
			default: ''
		},
		showSinger: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			page: 1,
			result: [],
			pullup: true,
			// 是否有更多数据
			hasMore: true,
			beforeScroll: true,
			title: '抱歉，暂无搜索结果'
		}
	},
	components: {
		'v-scroll': Scroll,
		'v-loading': Loading,
		'v-noResult': NoResult
	},
	methods: {
		refresh() {
			this.$refs.suggest.refresh()
		},
		search() {
			this.page = 1
			this.hasMore = true
			this.$refs.suggest.scrollTo(0, 0)
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				if (res.code === ERR_OK) {
					this.result = this._genResult(res.data)
					this._checkMore(res.data)
				}
			})
		},
		searchMore() {
			if (!this.hasMore) {
				return
			}
			this.page++
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				if (res.code === ERR_OK) {
					this.result = this.result.concat(this._genResult(res.data))
					this._checkMore(res.data)
				}
			})
		},
		selectItem(item) {
			if (item.type === 'singer') {
				const singer = new Singer({
					id: item.singermid,
					name: item.singername
				})
				console.log(singer)
				this.$router.push({
					path: `/search/${singer.id}`
				})
				this.setSinger(singer)
			} else {
				this.insertSong(item)
			}
			this.$emit('select')
		},
		listScroll() {
			this.$emit('listScroll')
		},
		_checkMore(data) {
			const song = data.song
			if (!song.list.length || song.curpage * perpage > song.totalnum) {
				this.hasMore = false
			}
		},
		_genResult(data) {
			let ret = []
			if (data.zhida && data.zhida.singerid && this.page === 1) {
				ret.push({...data.zhida, ...{type: 'singer'}})
			}
			if (data.song) {
				ret = ret.concat(this._normallizeSong(data.song.list))
			}
			return ret
		},
		getIconCls(item) {
			if (item.type === 'singer') {
				return 'icon-mine'
			} else {
				return 'icon-music'
			}
		},
		getDisplayName(item) {
			if (item.type === 'singer') {
				return item.singername
			} else {
				return `${item.name}-${item.singer}`
			}
		},
		_normallizeSong(list) {
			let ret = []
			list.forEach((musicData) => {
				if (musicData.songid && musicData.albumid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		},
		...mapMutations({
			'setSinger': 'SET_SINGER'
		}),
		...mapActions([
			'insertSong'
		])
	},
	watch: {
		query(newQuery) {
			this.search()
		}
	}
}
</script>
<style lang='scss' scoped>
@import '../../common/scss/variable';
@import '../../common/scss/mixin';
.suggest{
	height: 100%;
	.suggestWrapper{
		overflow: hidden;
		.suggest-list{
			padding: 0 30px;
			.suggest-item{
				display: flex;
				align-items: center;
				padding-bottom: 20px;
				.icon{
					flex: 0 0 30px;
					width: 30px;
					[class^="icon-"]{
						font-size: 14px;
						color: $color-text-d;
					}
				}
				.name{
					flex: 1;
					font-size: $font-size-medium;
				    color: $color-text-d;
				    overflow: hidden;
				    .text{
	          			@include nowrap()
				    }
				}
			}
		}
	}
	.no-result-wrapper{
		position: absolute;
		top: 50%;
		width: 100%;
		transform: translateY(-50%);
	}
}
</style>