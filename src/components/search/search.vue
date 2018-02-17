<template>
	<div class="search">
		<div class="search-box-wrapper">
			<v-searchBox ref="searchBox" @query="queryChange"></v-searchBox>
		</div>
		<div class="shortcutWrapper" v-show="!query" ref="shortcutWrapper">
			<v-scroll class="shortcut" :data="shortcut" ref="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li class="item" v-for="(item, index) in hotKey" @click="addQuery(item.k)">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click.stop="deleteAll">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<v-searchList :searches="searchHistory" @select="addQuery" @delete="deleteOne"></v-searchList>
					</div>
				</div>
			</v-scroll>
		</div>
		<div class="search-result" v-show="query" ref="searchResult">
			<v-suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></v-suggest>
		</div>
		<v-confirm ref="confirm" confirmBtnText="清空" text="是否清空搜索历史？" @confirm="clearSearchHistory"></v-confirm>
		<router-view></router-view>
	</div>
</template>
<script>
import SearchBox from '../../base/search-box/search-box'
import Suggest from '../../components/suggest/suggest'
import {getHotKey} from '../../api/search'
import {ERR_OK} from '../../api/config'
import SearchList from '../../base/search-list/search-list'
import Confirm from '../../base/confirm/confirm'
import {mapActions, mapGetters} from 'vuex'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin, searchMixin} from '../../common/js/mixin'
export default {
	mixins: [playlistMixin, searchMixin],
	data() {
		return {
			hotKey: []
		}
	},
	components: {
		'v-searchBox': SearchBox,
		'v-suggest': Suggest,
		'v-searchList': SearchList,
		'v-confirm': Confirm,
		'v-scroll': Scroll
	},
	computed: {
		shortcut() {
			return this.hotKey.concat(this.searchHistory)
		},
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.searchResult.style.paddingBottom = bottom
			this.$refs.suggest.refresh()
			this.$refs.shortcutWrapper.style.paddingBottom = bottom
			this.$refs.shortcut.refresh()
		},
		_getHotKey() {
			getHotKey().then((res) => {
				if (res.code === ERR_OK) {
					this.hotKey = res.data.hotkey.slice(0, 10)
				}
			})
		},
		deleteOne(item) {
			this.deleteSearchHistory(item)
		},
		deleteAll() {
			this.$refs.confirm.show()
			// this.clearSearchHistory()
		},
		...mapActions([
			'clearSearchHistory'
		])
	},
	watch: {
		query(newQuery) {
			if (!newQuery) {
				setTimeout(() => {
					this.$refs.shortcut.refresh()
				}, 20)
			}
		}
	},
	created() {
		this._getHotKey()
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.search{
	.search-box-wrapper{
		margin: 20px;
	}
	.shortcutWrapper{
		position: fixed;
		top: 178px;
		bottom: 0;
		width: 100%;
		.hot-key{
			margin: 0 20px 20px 20px;
			.title{
				margin-bottom: 20px;
				font-size: $font-size-medium;
				color: $color-text-l;
			}
			.item{
				display: inline-block;
				padding: 5px 10px;
				margin: 0 20px 10px 0;
				border-radius: 6px;
				background: $color-highlight-background;
	            font-size: $font-size-medium;
	            color: $color-text-d;
			}
		}
		.search-history{
			position: relative;
			margin: 0 20px;
			.title{
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
	.search-result{
		position: fixed;
		top: 178px;
		bottom: 0;
		width: 100%;
	}
}
</style>