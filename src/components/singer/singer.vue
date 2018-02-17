<template>
	<div class="singer" ref="singer">
		<v-listView :data="singers" @select="selectSinger" ref="singerList"></v-listView>
		<router-view></router-view>
	</div>
</template>
<script>
	import {getSingerList} from '../../api/singer.js'
	import {ERR_OK} from '../../api/config.js'
	import listView from '../../base/listView/listView'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from '../../common/js/mixin'
	const HOT_NAME = '热门'
	const HOT_SINGER_LEN = 10
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				singers: []
			}
		},
		components: {
			'v-listView': listView
		},
		methods: {
			getSingerList() {
				getSingerList().then((res) => {
					console.log(res)
					if (res.code === 0) {
						this.singers = this.normalizeSinger(res.data.list)
					}
				})
			},
			normalizeSinger(list) {
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((value, index) => {
					if (index < HOT_SINGER_LEN) {
						map.hot.items.push({
							id: value.Fsinger_mid,
							name: value.Fsinger_name,
							avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${value.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					const key = value.Findex
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push({
						id: value.Fsinger_mid,
						name: value.Fsinger_name,
						avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${value.Fsinger_mid}.jpg?max_age=2592000`
					})
				})
				let hot = []
				let ret = []
				for (let key in map) {
					let val = map[key]
					if (val.title.match(/[a-z,A-Z]/)) {
						ret.push(val)
					} else if (val.title === HOT_NAME) {
						hot.push(val)
					}
				}
				ret.sort((a, b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
			selectSinger(singer) {
				this.$router.push({
					path: `/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.singer.style.paddingBottom = bottom
				this.$refs.singerList.refresh()
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
		},
		mounted() {
			this.getSingerList()
		}
	}
</script>
<style lang="scss" scoped>
  .singer{
  	height: 100%;
  }
</style>