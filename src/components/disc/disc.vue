<template>
	<transition name="slide">
		<v-musicList :title="title" :bgImage="bgImage" :data="songs"></v-musicList>
	</transition>
</template>
<script>
import MusicList from '../../components/musicList/musicList'
import {getSongList} from '../../api/recommend'
import {mapGetters} from 'vuex'
import {ERR_OK} from '../../api/config.js'
import {createSong} from '../../common/js/song'
export default {
	data() {
		return {
			songs: []
		}
	},
	computed: {
		title() {
			return this.disc.dissname
		},
		bgImage() {
			return this.disc.imgurl
		},
		...mapGetters([
			'disc'
		])
	},
	components: {
		'v-musicList': MusicList
	},
	methods: {
		_getSongList() {
			if (!this.disc.dissid) {
				this.$router.back()
				return
			}
			getSongList(this.disc.dissid).then((res) => {
				if (res.code === ERR_OK) {
					this.songs = this.normallizeSongs(res.cdlist[0].songlist)
				}
			})
		},
		normallizeSongs(list) {
			let ret = []
			list.forEach((musicData) => {
				if (musicData.songid && musicData.albumid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	created() {
		this._getSongList()
	}
}
</script>
<style lang='scss' scoped>
.slide-enter-active,.slide-leave-active{
	transition: all .3s;
}
.slide-enter,.slide-leave-to{
	transform: translate3d(100%,0,0);
}
</style>