import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle, saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/util'
import {getSongUrlData} from '../api/song.js'
import {ERR_OK} from '../api/config.js'

function findIndex(list, song) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

export const selectPlay = function ({commit, state}, {list, index}) {
	// 这里传进来的是顺序列表
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode === playMode.random) {
		index = findIndex(list, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
	let randomList = shuffle(list)
	let mid = randomList[0].mid
	let url = ''
	getSongUrlData(mid).then((res) => {
		if (res.code === ERR_OK) {
			url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
		}
		commit(types.SET_PLAY_MODE, playMode.random)
		commit(types.SET_SEQUENCE_LIST, list)
		commit(types.SET_PLAYLIST, randomList)
		commit(types.SET_CURRENT_INDEX, 0)
		commit(types.SET_FULL_SCREEN, true)
		commit(types.SET_PLAYING_STATE, true)
		commit(types.SET_SONG_URL, url)
	})
}

export const currentIndexs = function ({commit}, {song, index}) {
	let url
	getSongUrlData(song.mid).then((res) => {
		if (res.code === ERR_OK) {
			url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
		}
		commit(types.SET_CURRENT_INDEX, index)
		commit(types.SET_SONG_URL, url)
	})
}

export const insertSong = function ({commit, state}, song) {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playlist[currentIndex]
	// 查找当前列表中是否有待插入的歌曲
	let fpIndex = findIndex(playlist, song)
	currentIndex++
	// 插入这首歌到当前索引位置
	playlist.splice(currentIndex, 0, song)
	// 已有这首歌
	if (fpIndex > -1) {
		if (currentIndex > fpIndex) {
			playlist.splice(fpIndex, 1)
			currentIndex--
		} else {
			playlist.splice(fpIndex + 1, 1)
		}
	}
	// 当前播放的歌曲在原始列表中的index
	let currentSindex = findIndex(sequenceList, currentSong) + 1
	// 点击的歌曲在原始列表中的位置
	let fsIndex = findIndex(sequenceList, song)
	sequenceList.splice(currentSindex, 0, song)
	if (fsIndex > -1) {
		if (currentSindex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}
	let url
	getSongUrlData(song.mid).then((res) => {
		if (res.code === ERR_OK) {
			url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
		}
		commit(types.SET_PLAYLIST, playlist)
		commit(types.SET_SEQUENCE_LIST, sequenceList)
		commit(types.SET_CURRENT_INDEX, currentIndex)
		commit(types.SET_FULL_SCREEN, true)
		commit(types.SET_PLAYING_STATE, true)
		commit(types.SET_SONG_URL, url)
		console.log(currentIndex, playlist)
	})
}

export const saveSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({commit, state}, song) {
	let flag = false
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex

	if (playlist[currentIndex].id === song.id && playlist.length > 1) {
		flag = true
	}

	commit(types.SET_SEARCH_HISTORY, clearSearch())
	let pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	if (currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--
	}

	let url
	if (flag && playlist.length) {
		getSongUrlData(playlist[currentIndex].mid).then((res) => {
			if (res.code === ERR_OK) {
				url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
			}
			commits(() => {
				commit(types.SET_SONG_URL, url)
				if (!state.playing && playlist.length) {
					commit(types.SET_PLAYING_STATE, true)
				}
			})
		})
	} else {
		commits()
	}
	function commits(callback = function() {}) {
		commit(types.SET_PLAYLIST, playlist)
		commit(types.SET_SEQUENCE_LIST, sequenceList)
		commit(types.SET_CURRENT_INDEX, currentIndex)
		callback()
		if (!playlist.length) {
			commit(types.SET_PLAYING_STATE, false)
		}
	}
}

export const deleteSongList = function({commit}) {
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}