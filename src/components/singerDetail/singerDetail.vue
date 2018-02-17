<template>
	<transition name="wrap">
		<div class="singer_detail">
			<v-musicList :data="songs" :title="title" :bgImage="bgImage"></v-musicList>
		</div>
	</transition>
</template>
<script>
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from '../../api/singer.js'
	import {ERR_OK} from '../../api/config.js'
	import {createSong} from '../../common/js/song.js'
	import musicList from '../musicList/musicList'
	export default {
		data() {
			return {
				songs: []
			}
		},
		components: {
			'v-musicList': musicList
		},
		computed: {
			bgImage () {
				return this.singer.avatar
			},
			title() {
				return this.singer.name
			},
			...mapGetters([
				'singer'
			])
		},
		methods: {
			getDetail() {
				if (!this.singer.id) {
					this.$router.push('/singer')
				}
				getSingerDetail(this.singer.id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this.normalizeSongs(res.data.list)
						console.log(this.songs)
					}
				})
			},
			normalizeSongs(list) {
				let ret = []
				list.forEach((value, index) => {
					// ES6的结构赋值
					let {musicData} = value
					if (musicData.songid && musicData.albummid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		created() {
			this.getDetail()
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../common/scss/variable.scss';
	.singer_detail{
		position: fixed;
		z-index: 101;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: $color-background;
		&.wrap-enter,&.wrap-leave-active{
			transform: translate3d(100%,0,0);
			opacity: 0;
		},
		&.wrap-enter-active,&.wrap-leave-active{
			transition: all 0.3s;
		}
	}
</style>