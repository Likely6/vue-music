import storage from 'good-storage'
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
// 洗牌
export function shuffle(arr) {
	// 注意：这里的arr需要深度拷贝一下，否则会改变传入的arr的顺序
	let _arr = arr.slice()
	for (let i = 0; i < _arr.length; i++) {
		let j = getRandom(0, i)
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	return _arr
}
// 节流函数
export function debounce(func, delay) {
	let timer
	return function(...args) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

function insertArray(arr, val, compare, maxLen) {
	const index = arr.findIndex(compare)
	if (index === 0) {
		return
	}
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(val)
	if (maxLen && arr.length > maxLen) {
		arr.pop()
	}
}
function deleteFromArray(arr, compare) {
	const index = arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 缓存函数	添加
export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 缓存函数	删除
export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, (item) => {
		return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 缓存函数	清空
export function clearSearch(query) {
	storage.remove(SEARCH_KEY)
	return []
}

export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
	let songs = storage.get(PLAY_KEY, [])
	insertArray(songs, song, (item) => {
		return item.id === song.id
	}, PLAY_MAX_LENGTH)
	storage.set(PLAY_KEY, songs)
	return songs
}

export function loadPlay() {
	return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, (item) => {
		return song.id === item.id
	}, FAVORITE_MAX_LENGTH)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function deleteFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	deleteFromArray(songs, (item) => {
		return song.id === item.id
	})
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function loadFavorite() {
	return storage.get(FAVORITE_KEY, [])
}