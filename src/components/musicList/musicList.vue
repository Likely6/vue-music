<template>
	<div class="music_list">
		<div class="music_top" ref="musicTop">
			<div class="top_back" @click="prepage">
				<span class="icon-back"></span>
			</div>
			<h1 class="top_title" v-html="title"></h1>
		</div>
		<div class="music_bg" ref="musicBg">
			<div class="bg_img" ref="bgImg" :style="bgImageUrl"></div>
			<div class="bg_funBtn" ref="bgFunBtn">
				<div class="funBtn_panel" @click="random">
					<span class="icon-play"></span>
					<p>随机播放全部</p>
				</div>
			</div>
			<div class="bg_mask" ref="bgMask"></div>
		</div>
		<div class="list_mask" ref="listMask"></div>
		<div class="song_list" ref="songList">
			<v-scroll :data="data" :listenScroll="true" :probeType="3" @scroll="scroll" ref='list'>
				<v-songList :data="data" @select="selectItem" :rank="rank"></v-songList>
			</v-scroll>
		</div>
		<v-loading class="loadingContainer" v-show="!data.length"></v-loading>
	</div>
</template>
<script>
	import scroll from '../../base/scroll/scroll'
	import songList from '../../base/songList/songList'
	import loading from '../../base/loading/loading'
	import {prefixStyle} from '../../common/js/dome.js'
	import {getSongUrlData} from '../../api/recommend.js'
	import {ERR_OK} from '../../api/config.js'
	import {mapActions} from 'vuex'
	import {playlistMixin} from '../../common/js/mixin'
	const transform = prefixStyle('transform')
	const topHeight = 44
	export default {
		mixins: [playlistMixin],
		props: {
			data: {
				type: Array,
				default: []
			},
			bgImage: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				scrollY: 0
			}
		},
		components: {
			'v-scroll': scroll,
			'v-songList': songList,
			'v-loading': loading
		},
		computed: {
			bgImageUrl() {
				return `background-image:url(${this.bgImage})`
			}
		},
		watch: {
			scrollY(newY) {
				const precent = Math.abs(newY / this.imageHeight)
				let scaleB = 1.1 + precent
				let scaleS = Math.max(1.1 - precent, 1)
				let translateY = Math.max(this.minTranslateY + topHeight, newY)
				let blur = Math.min(4 * precent, 2)
				this.$refs.listMask.style[transform] = `translate3d(0, ${translateY}px, 0)`
				if (newY < 0) {
					// 往上滑时图片向上移动、缩小且变模糊,
					this.$refs.bgImg.style['filter'] = `blur(${blur}px)`
					this.$refs.bgImg.style[transform] = `scale(${scaleS}) translate3d(0, ${translateY}px, 0)`
					this.$refs.bgMask.style[transform] = `scale(${scaleS})`
					// 随机播放按钮1.5倍向上移动
					this.$refs.bgFunBtn.style[transform] = `translate3d(0, ${translateY * 1.5}px, 0)`
					// 上拉时溢出隐藏
					this.$refs.musicBg.style['overflow'] = `hidden`
				} else {
					// 往下拉时图片放大
					this.$refs.bgImg.style[transform] = `scale(${scaleB})`
					this.$refs.bgMask.style[transform] = `scale(${scaleB})`
					// 下拉时溢出不隐藏
					this.$refs.musicBg.style['overflow'] = `visible`
					// 随机播放按钮向下移动
					this.$refs.bgFunBtn.style[transform] = `translate3d(0, ${translateY}px, 0)`
				}
				if (newY < this.minTranslateY + topHeight) {
					this.$refs.musicBg.style['height'] = `${topHeight}px`
					this.$refs.musicBg.style['zIndex'] = `9`
				} else {
					this.$refs.musicBg.style['height'] = `auto`
					this.$refs.musicBg.style['zIndex'] = `1`
				}
			}
		},
		methods: {
			prepage() {
				// this.$router.push('/singer')
				this.$router.back()
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			selectItem(item, index) {
				this.selectPlay({
					list: this.data,
					index: index
				})
			},
			random() {
				this.randomPlay({
					list: this.data
				})
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				// 控制台打出来看看结构就明白了
				const dom = this.$refs.list.$el.children[0]
				dom.style.paddingBottom = bottom
				this.$refs.list.refresh()
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		created() {
			let _this = this
			this.$nextTick(function() {
				_this.imageHeight = _this.$refs.bgImg.clientHeight
				_this.minTranslateY = -_this.imageHeight
				_this.$refs.songList.style.top = _this.imageHeight - 3 + 'px'
			})
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../common/scss/variable.scss';

	$top_height:44px;
	.music_list{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom:0;
		z-index: 100;
		.music_top{
			position: fixed;
			z-index: 10;
			width: 100%;
			top: 0;
			height: $top_height;
			.top_back{
				position: absolute;
				top: 0;
				left: 20px;
				height: $top_height;
				display: flex;
				align-items:center;
				span{
					position: relative;
					font-size: $font-size-large-x;
					color: $color-theme;
					&:after{
						content: '';
						position: absolute;
						top: -10px;
						left: -10px;
						bottom: -10px;
						right: -10px;
					}
				}
			}
			.top_title{
				height: $top_height;
				line-height: $top_height;
				width: 100%;
				text-align: center;
				font-size: $font-size-large;
				color: $color-text;
			}
		}
		.music_bg{
			position: relative;
			z-index: 1;
			overflow: hidden;
			background: $color-background;
			.bg_img{
				transform: scale(1.1);
				transform-origin: top;
				background-size: cover;
				width: 100%;
				height: 0;
				padding-top: 70%;
			}
			.bg_funBtn{
				position: absolute;
				z-index: 2;
				width: 100%;
				bottom: 20px;
				text-align:center;
				.funBtn_panel{
					display: inline-block;
					margin: 0 auto;
					border-radius: 100px;
					border: 1px solid $color-theme;
					padding: 8px 10px;
					span{
						display: inline-block;
						vertical-align: middle;
						font-size: $font-size-medium-x;
						color: $color-theme;
						margin-right: 6px;
					}
					p{
						display: inline-block;
						vertical-align: middle;
						font-size: $font-size-small;
						color: $color-theme;
					}
				}
			}
			.bg_mask{
				transform-origin: top;
				transform: scale(1.1);
				position: absolute;
				z-index: 1;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: rgba(7,17,27,0.4);
			}
		}
		.list_mask{
			position: relative;
			width: 100%;
			height: 100%;
			z-index: 2;
			background-color: $color-background;
		}
		.song_list{
			position: absolute;
			z-index: 2;
			width: 100%;
			bottom:0;
			background-color: $color-background;
			#scrollWrapper{
				overflow: visible;
			}
		}
		.loadingContainer{
			position: absolute;
			z-index: 99;
  		left: 0;
  		top: 50%;
  		transform: translateY(-50%);
  		width: 100%;
		}
	}
</style>