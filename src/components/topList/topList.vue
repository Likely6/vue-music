<template>
	<transition name="slide">
		<v-musicList :bgImage="bgImage" :title="title" :data="songs" :rank="true"></v-musicList>
	</transition>
</template>
<script>
import MusicList from '../../components/musicList/musicList'
import {getMusicList} from '../../api/rank'
import {mapGetters} from 'vuex'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'
export default {
	data() {
		return {
			songs: []
		}
	},
	components: {
		'v-musicList': MusicList
	},
	computed: {
		title() {
			return this.toplist.topTitle
		},
		bgImage() {
			if (this.songs.length) {
				return this.songs[0].image
			}
			return ''
		},
		...mapGetters([
			'toplist'
		])
	},
	methods: {
		_getTopList() {
			if (!this.toplist.id) {
				this.$router.back()
				return
			}
			getMusicList(this.toplist.id).then((res) => {
				if (res.code === ERR_OK) {
					this.songs = this._normallizeSongs(res.songlist)
				}
			})
		},
		_normallizeSongs(list) {
			let ret = []
			list.forEach((item) => {
				const musicData = item.data
				if (musicData.songid && musicData.albumid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	created() {
		this._getTopList()
	}
}
</script>
<style lang='scss' scoped>
.slide-enter-active,.slide-leave-active{
	transition: all .3s;
}
.slide-enter,.slide-leave-to{
	transform: translate3d(100%, 0, 0);
}
</style>