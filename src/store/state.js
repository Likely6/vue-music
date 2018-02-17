import {playMode} from '../common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '../common/js/util'
const state = {
	singer: {},
	songUrl: '',
	// 播放状态
	playing: false,
	// 全屏或迷你
	fullScreen: false,
	// 播放列表
	playlist: [],
	// 播放模式列表(不同模式时的列表)
	sequenceList: [],
	// 播放模式
	mode: playMode.sequence,
	// 当前播放的歌的索引
	currentIndex: -1,
	// 歌单对象
	disc: {},
	// 排行榜歌单数据
	toplist: [],
	searchHistory: loadSearch(),
	// 播放历史
	playHistory: loadPlay(),
	// 收藏列表
	favoritelist: loadFavorite()
}

export default state