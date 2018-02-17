<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal"
					@enter="enter"
					@after-enter="afterEnter"
					@leave="leave"
					@after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle"
					@touchstart.prevent="middleTStart"
					@touchmove.prevent="middleTMove"
					@touchend="middleTEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdRotate">
								<img class="image" :src="currentSong.image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">
								{{playingLyric}}
							</div>
						</div>
					</div>
					<v-scroll class="middle-r" ref="lyricList" :data="currentLyric ? currentLyric.lines : []">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricLine"
									class="text"
									:class="{'current':currentLineNum === index}"
									v-for="(line, index) in currentLyric.lines">
										{{line.txt}}
								</p>
							</div>
						</div>
					</v-scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active':currentShow==='cd'}"></span>
						<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<v-progressBar :percent="percent" @percentChange="percentChange"></v-progressBar>
						</div>
						<span class="time timr-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="selectMode">
							<i :class="iconMode"></i>
						</div>
						<div class="icon i-left" @click="prev" :class="disableOperate">
							<i class="icon-prev"></i>
						</div>
						<div class="icon i-center" @click="togglePlaying" :class="disableOperate">
							<i :class="playIcon"></i>
						</div>
						<div class="icon i-right" @click="next" :class="disableOperate">
							<i class="icon-next"></i>
						</div>
						<div class="icon i-right">
							<i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img width="40" height="40" :src="currentSong.image" :class="cdRotate">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<v-progressCircle :radius="32" :percent="percent">
						<i class="icon-mini" :class="playMiniIcon" @click.stop="togglePlaying"></i>
					</v-progressCircle>
				</div>
				<div class="control" @click.stop="showPlaylist">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<audio :src="songUrl" ref="audio" @canplay="read" @error="error" @timeupdate="updateTime" @ended="end"></audio>
		<v-playlist ref="playlist"></v-playlist>
	</div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import progressBar from '../../base/progress-bar/progress-bar'
import progressCircle from '../../base/progress-circle/progress-circle'
import {prefixStyle} from '../../common/js/dome'
import {playMode} from '../../common/js/config.js'
import {getSongUrlData} from '../../api/song.js'
import {ERR_OK} from '../../api/config.js'
import Lyric from 'lyric-parser'
import Scroll from '../../base/scroll/scroll'
import Playlist from '../../components/playlist/playlist'
import {playerMixin} from '../../common/js/mixin'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
	mixins: [playerMixin],
	data() {
		return {
			// 歌曲是否相应
			readPlay: false,
			currentTime: 0,
			// 歌词数据
			currentLyric: null,
			// 歌词当前所在行数
			currentLineNum: 0,
			// 当前显示界面（cd页或歌词页）
			currentShow: 'cd',
			// 当前歌词
			playingLyric: ''
		}
	},
	components: {
		'v-progressBar': progressBar,
		'v-progressCircle': progressCircle,
		'v-scroll': Scroll,
		'v-playlist': Playlist
	},
	computed: {
		playIcon() {
			return this.playing ? 'icon-pause' : 'icon-play'
		},
		playMiniIcon() {
			return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		},
		cdRotate() {
			return this.playing ? 'play' : 'play pause'
		},
		disableOperate() {
			return this.readPlay ? '' : 'disable'
		},
		percent() {
			return this.currentTime / this.currentSong.duration
		},
		...mapGetters([
			'fullScreen',
			'playlist',
			'sequenceList',
			'currentIndex',
			'currentSong',
			'playing',
			'songUrl',
			'mode'
		])
	},
	methods: {
		back() {
			this.setFullScreen(false)
		},
		open() {
			this.setFullScreen(true)
		},
		enter(el, done) {
			const {x, y, scale} = this.getPostAndScale()
			console.log(this.getPostAndScale())
			let animation = {
				0: {
					transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0, 0, 0) scale(1.1)`
				},
				100: {
					transform: `translate3d(0, 0, 0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 400,
					easing: 'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper, 'move', done)
		},
		afterEnter() {
			animations.unregisterAnimation('move')
			this.$refs.cdWrapper.style.animation = ''
		},
		leave(el, done) {
			this.$refs.cdWrapper.style.transition = 'all .4s'
			const {x, y, scale} = this.getPostAndScale()
			this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
			// transitionend事件监听
			this.$refs.cdWrapper.addEventListener('transitionend', done)
		},
		afterLeave() {
			this.$refs.cdWrapper.style.transition = ''
			this.$refs.cdWrapper.style[transform] = ''
		},
		togglePlaying() {
			if (!this.readPlay) {
				return
			}
			this.setPlayingState(!this.playing)
			if (this.currentLyric) {
				// 切换歌词状态（播放或暂停）
				this.currentLyric.togglePlay()
			}
		},
		prev() {
			if (!this.readPlay) {
				return
			}
			if (this.playlist.length === 1) {
				// 如果列表只有一首歌则单曲循环
				this.loop()
			} else {
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playlist.length - 1
				}
				this.setCurrentIndex(index)
				this.getSongUrl(this.playlist[index].mid)
				this.readPlay = false
			}
		},
		next() {
			if (!this.readPlay) {
				return
			}
			if (this.playlist.length === 1) {
				// 如果列表只有一首歌则单曲循环
				this.loop()
			} else {
				let index = this.currentIndex + 1
				if (index === this.playlist.length) {
					index = 0
				}
				this.setCurrentIndex(index)
				this.getSongUrl(this.playlist[index].mid)
				this.readPlay = false
			}
		},
		read() {
			this.readPlay = true
			this.savePlayHistory(this.currentSong)
		},
		error() {
			this.readPlay = true
		},
		updateTime(e) {
			this.currentTime = e.target.currentTime
		},
		end() {
			if (this.mode === playMode.loop) {
				this.loop()
			} else {
				this.next()
			}
		},
		loop() {
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
			if (this.currentLyric) {
				// 循环播放时一首歌结束后歌词位置重置到0s时
				this.currentLyric.seek()
			}
		},
		showPlaylist() {
			this.$refs.playlist.show()
		},
		format (interval) {
			interval = interval | 0
			const minute = interval / 60 | 0
			const second = this._pad(interval % 60)
			return `${minute}:${second}`
		},
		_pad(num, n = 2) {
			let len = num.toString().length
			while (len < n) {
				num = '0' + num
				len++
			}
			return num
		},
		percentChange(percent) {
			const currentTime = this.currentSong.duration * percent
			this.$refs.audio.currentTime = currentTime
			if (!this.playing) {
				this.togglePlaying()
			}
			if (this.currentLyric) {
				// 当拉动进度条时歌词定位到对应时间的那句歌词
				this.currentLyric.seek(currentTime * 1000)
			}
		},
		getSongUrl(mid) {
			if (!this.playing) {
				this.togglePlaying()
			}
			getSongUrlData(mid).then((res) => {
				if (res.code === ERR_OK) {
					const url = `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=6230861934&uin=0&fromtag=66`
					this.setSongUrl(url)
				}
			})
		},
		getLyric() {
			this.currentSong.getLyric().then((lyric) => {
				this.currentLyric = new Lyric(lyric, this.handleLyric)
				if (this.playing) {
					this.currentLyric.play()
				}
			}).catch(() => {
				this.currentLyric = null
				this.playingLyric = ''
				this.currentLineNum = 0
			})
		},
		handleLyric({lineNum, txt}) {
			this.currentLineNum = lineNum
			if (lineNum > 5) {
				let lineEl = this.$refs.lyricLine[lineNum - 5]
				this.$refs.lyricList.scrollToElement(lineEl, 1000)
			} else {
				let lineEl = this.$refs.lyricLine[0]
				this.$refs.lyricList.scrollTo(lineEl, 1000)
			}
			this.playingLyric = txt
		},
		middleTStart(e) {
			this.touch.initiated = true
			// 用来判断是否是一次移动
			this.touch.moved = false
			const touch = e.touches[0]
			this.touch.startX = touch.pageX
			this.touch.startY = touch.pageY
		},
		middleTMove(e) {
			if (!this.touch.initiated) {
				return
			}
			const touch = e.touches[0]
			const deltaX = touch.pageX - this.touch.startX
			const deltaY = touch.pageY - this.touch.startY
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				return
			}
			if (!this.touch.moved) {
				this.touch.moved = true
			}
			// 因为lyricList是个组件，无法直接拿到属性，需要再通过$el拿到
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
			this.$refs.lyricList.$el.style[transitionDuration] = 0
			this.$refs.middleL.style[transitionDuration] = 0
		},
		middleTEnd() {
			if (!this.touch.moved) {
				return
			}
			let offsetWidth, opacity
			if (this.currentShow === 'cd') {
				if (this.touch.percent > 0.1) {
					offsetWidth = -window.innerWidth
					opacity = 0
					this.currentShow = 'lyric'
				} else {
					offsetWidth = 0
					opacity = 1
				}
			} else {
				console.log(this.touch.percent)
				if (this.touch.percent < 0.9) {
					offsetWidth = 0
					opacity = 1
					this.currentShow = 'cd'
				} else {
					offsetWidth = -window.innerWidth
					opacity = 0
				}
			}
			const time = 300
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
			this.$refs.middleL.style['opacity'] = opacity
			this.$refs.middleL.style[transitionDuration] = `${time}ms`
			this.touch.initiated = false
		},
		getPostAndScale() {
			const targetWidth = 40
			const paddingLeft = 40
			const paddingBottom = 30
			const paddingTop = 80
			const width = window.innerWidth * 0.8
			const scale = targetWidth / width
			const x = -(window.innerWidth / 2 - paddingLeft)
			const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
			return {
				x,
				y,
				scale
			}
		},
		...mapMutations({
			setFullScreen: 'SET_FULL_SCREEN',
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setSongUrl: 'SET_SONG_URL',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
		}),
		...mapActions([
			'savePlayHistory'
		])
	},
	watch: {
		currentSong(newSong, oldSong) {
			if (!newSong.id) {
				return
			}
			if (newSong.id === oldSong.id) {
				return
			}
			if (this.currentLyric) {
				// 当已经new了lyric时停止计时器（防止歌词跳动）
				this.currentLyric.stop()
			}
			this.$nextTick(() => {
				this.$refs.audio.play()
				this.getLyric()
			})
		},
		songUrl() {
			this.$nextTick(() => {
				this.$refs.audio.play()
			})
		},
		playing(newPlaying) {
			const audio = this.$refs.audio
			this.$nextTick(() => {
				newPlaying ? audio.play() : audio.pause()
			})
		}
	},
	created() {
		this.touch = {}
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.player{
	.normal-player{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 150;
		background: $color-background;
		.background{
			position: absolute;
	        left: 0;
	        top: 0;
	        width: 100%;
	        height: 100%;
	        z-index: -1;
	        opacity: 0.6;
	        filter: blur(20px);
		}
		.top{
			position: relative;
	        margin-bottom: 25px;
	        .back{
				position: absolute;
				top: 0;
				left: 6px;
				z-index: 50;
				.icon-back{
					display: block;
					padding: 9px;
					font-size: $font-size-large-x;
					color: $color-theme;
					transform: rotate(-90deg);
				}
	        }
			.title{
				width: 70%;
				margin: 0 auto;
				line-height: 40px;
				text-align: center;
				font-size: $font-size-large;
				color: $color-text;
			}
			.subtitle{
				line-height: 20px;
				text-align: center;
				font-size: $font-size-medium;
				color: $color-text;
			}
		}
		.middle{
	        position: fixed;
	        width: 100%;
	        top: 80px;
	        bottom: 170px;
	        white-space: nowrap;
	        font-size: 0;
	        .middle-l{
				display: inline-block;
				vertical-align: top;
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 80%;
				.cd-wrapper{
					position: absolute;
					left: 10%;
					top: 0;
					width: 80%;
					height: 100%;
					.cd{
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						border: 10px solid rgba(255, 255, 255, 0.1);
						border-radius: 50%;
						&.play{
							animation: rotate 20s linear infinite;
						}
						&.pause{
							animation-play-state: paused;
						}
					  	.image{
					        position: absolute;
					        left: 0;
					        top: 0;
					        width: 100%;
					        height: 100%;
					        border-radius: 50%;
					    }
					}
				}
				.playing-lyric-wrapper{
					width: 80%;
					margin: 30px auto 0 auto;
					overflow: hidden;
					text-align: center;
					.playing-lyric{
						height: 20px;
						line-height: 20px;
						font-size: $font-size-medium;
						color: $color-text-l;
					}
				}
			}
			.middle-r{
				display: inline-block;
				vertical-align: top;
				width: 100%;
				height: 100%;
				overflow: hidden;
				.lyric-wrapper{
					width: 80%;
					margin: 0 auto;
					overflow: hidden;
					text-align: center;
					.text{
						line-height: 32px;
						color: $color-text-l;
						font-size: $font-size-medium;
						&.current{
							color: $color-text;
						}
					}
				}
			}
		}
      	.bottom{
	        position: absolute;
	        bottom: 50px;
	        width: 100%;
        	.dot-wrapper{
				text-align: center;
				font-size: 0;
				.dot{
					display: inline-block;
					vertical-align: middle;
					margin: 0 4px;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: $color-text-l;
		            &.active{
		              width: 20px;
		              border-radius: 5px;
		              background: $color-text-ll;
		           	}
		        }
          	}
	        .progress-wrapper{
				display: flex;
				align-items: center;
				width: 80%;
				margin: 0px auto;
				padding: 10px 0;
				.time{
					color: $color-text;
					font-size: $font-size-small;
					flex: 0 0 30px;
					line-height: 30px;
					width: 30px;
					&.time-l{
						text-align: left;
					}
					&.time-r{
						text-align: right;
					}
				}
				.progress-bar-wrapper{
					flex: 1;
				}
			}
	        .operators{
				display: flex;
				align-items: center;
				.icon{
					flex: 1;
					color: $color-theme;
					&.disable{
					  color: $color-theme-d;
					}
					i{
					  font-size: 30px;
					}
				}
				.i-left{
					text-align: right;
				}
				.i-center{
					padding: 0 20px;
					text-align: center;
					i{
				  		font-size: 40px;
					}
				}
				.i-right{
					text-align: left;
				}
				.icon-favorite{
					color: $color-sub-theme;
				}
	        }
      	}
      	&.normal-enter-active, &.normal-leave-active{
      		transition: all .4s;
      		.top, .bottom{
      			transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      		}
      	}
      	&.normal-enter, &.normal-leave-to{
      		opacity: 0;
      		.top{
      			transform: translateY(-100px);
      		}
      		.bottom{
      			transform: translateY(100px);
      		}
      	}
	}
	.mini-player{
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: $color-highlight-background;
		&.mini-enter-active, &.mini-leave-active{
			transition: all 0.4s;
		}
		&.mini-enter, &.mini-leave-to{
			opacity: 0;
		}
		.icon{
			flex: 0 0 40px;
			padding: 0 10px 0 20px;
			img{
				border-radius: 50%;
				&.play{
					animation: rotate 10s linear infinite;
				}
				&.pause{
					animation-play-state: paused;
				}
			}
		}
		.text{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			line-height: 20px;
			overflow: hidden;
			.name{
				margin-bottom: 2px;
				font-size: $font-size-medium;
				color: $color-text;
			}
			.desc{
				font-size: $font-size-small;
				color: $color-text-d;
			}
		}
		.control{
			flex: 0 0 30px;
			padding: 0 10px;
			.icon-play-mini, .icon-pause-mini, .icon-playlist{
				font-size: 30px;
				color: $color-theme-d;
			}
			.icon-mini{
				font-size: 32px;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
	}

	@keyframes rotate{
		0{
			transform: rotate(0);
		}
		100%{
			transform: rotate(360deg);
		}
	}
}
</style>
