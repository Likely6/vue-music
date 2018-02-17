import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from '../../common/js/config.js'
import {shuffle} from '../../common/js/util.js'
// mixin 当组件使用该mixin时，mixin里的东西将被应用到组件	组件以mixins: [playlistMixin]来使用
export const playlistMixin = {
	computed: {
		...mapGetters([
			'playlist'
		])
	},
	mounted() {
		this.handlePlaylist(this.playlist)
	},
	// keep-alive 组件激活时调用
	activated() {
		this.handlePlaylist(this.playlist)
	},
	watch: {
		playlist(newVal) {
			this.handlePlaylist(newVal)
		}
	},
	methods: {
		// 当组件有handlePlaylist方法时，会覆盖掉mixin里的
		handlePlaylist() {
			throw new Error('componetn must implement handlePlaylist methods')
		}
	}
}

export const playerMixin = {
	computed: {
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'fullScreen',
			'playlist',
			'sequenceList',
			'currentIndex',
			'currentSong',
			'playing',
			'songUrl',
			'mode',
			'favoritelist'
		])
	},
	methods: {
		selectMode() {
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlayList(list)
			console.log(this.playlist[this.currentIndex])
		},
		resetCurrentIndex(list) {
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		getFavoriteIcon(song) {
			if (this.isFavorite(song)) {
				return 'icon-favorite'
			}
			return 'icon-not-favorite'
		},
		toggleFavorite(song) {
			if (this.isFavorite(song)) {
				this.deleteFavoriteList(song)
			} else {
				this.saveFavoriteList(song)
			}
		},
		isFavorite(song) {
			const index = this.favoritelist.findIndex((item) => {
				return item.id === song.id
			})
			return index > -1
		},
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setSongUrl: 'SET_SONG_URL',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
		}),
		...mapActions([
			'saveFavoriteList',
			'deleteFavoriteList'
		])
	}
}

export const searchMixin = {
	data() {
		return {
			query: ''
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		blurInput() {
			this.$refs.searchBox.blur()
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		queryChange(query) {
			this.query = query
		},
		addQuery(query) {
			this.$refs.searchBox.setQuery(query)
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		])
	}
}