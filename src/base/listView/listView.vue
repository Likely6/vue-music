<template>
	<div class="listView">
		<v-scroll 
			:data="data" 
			ref="listview"
			:listenScroll="listenScroll"
			:probeType="probeType"
			@scroll="scroll">
			<ul class="list_group_panel">
				<li class="list_group" v-for="(group,index) in data" ref="listGroup">
					<h2 class="group_title">{{group.title}}</h2>
					<ul class="list_panel">
						<li class="list_once" v-for="(item,index) in group.items" @click="selectSinger(item)">
							<img class="once_img" v-lazy="item.avatar" alt="avatar">
							<div class="once_info">
								<h2>{{item.name}}</h2>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</v-scroll>
		<div class="list_shortcut" 
			@touchstart.stop.prevent="shortcutTouchStart"
			@touchmove.stop.prevent="shortcutTouchMove">
			<!-- shortcutTouchStart会向下捕获所有子元素 -->
			<ul class="shortcut_panel">
				<li class="shortcut_once" v-for="(item,index) in  shortcutList" :data-index="index" :class="{'active':currentIndex===index}">
					<span :data-index="index">{{item}}</span>
				</li>
			</ul>
		</div>
		<div class="list_fixed" v-show="fixedTitle.title" ref="listFixed">
			<h1 class="fixed_title">{{fixedTitle.title}}</h1>
		</div>
		<div class="loading_container" v-show="!data.length">
			<v-loading></v-loading>
		</div>
	</div>
</template>
<script>
	import {getData} from '../../common/js/dome.js'
	import scroll from '../../base/scroll/scroll'
	import loading from '../../base/loading/loading'
	const FIEXD_T_H = 30
	export default {
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				scrollY: -1,
				currentIndex: 0,
				diff: 0
			}
		},
		components: {
			'v-scroll': scroll,
			'v-loading': loading
		},
		computed: {
			shortcutList() {
				let res = this.data.map((value, index, array) => {
					return value.title.substr(0, 1)
				})
				return res
			},
			fixedTitle() {
				if (this.scrollY > 0) {
					return ''
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex] : 0
			}
		},
		watch: {
			data() {
				this.init()
			},
			scrollY(newY) {
				// 参数表示当前值
				// 当滚动到顶部
				if (newY > 0) {
					this.currentIndex = 0
					return
				}
				// 中间滚动
				const listHeight = this.listHeight
				for (let i = 0; i < listHeight.length - 1; i++) {
					let height1 = listHeight[i]
					let height2 = listHeight[i + 1]
					if (!height2 || (-newY >= height1 && -newY < height2)) {
						this.currentIndex = i
						this.diff = height2 + newY
						return
					}
				}
				// 滚动到底部
				this.currentIndex = listHeight.length - 1
			},
			diff(newVal) {
				let fixedTop = (newVal > 0 && newVal <= FIEXD_T_H - 1) ? Math.ceil(newVal - FIEXD_T_H) : 0
				if (this.fixedTop === fixedTop) {
					return
				}
				this.fixedTop = fixedTop
				this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
			}
		},
		methods: {
			init() {
				let _this = this
				if (this.data.length) {
					this.$nextTick(function() {
						let shortcutoncedom = document.querySelectorAll('.shortcut_once')[1]
						// 计算右侧ABC列表高度
						_this.shortcutonce_height = shortcutoncedom.clientHeight
						_this.calculateHeight()
					})
				}
			},
			shortcutTouchStart(e) {
				let anchorIndex = getData(e.target, 'index')
				let firstTouch = e.touches[0]
				this.touch.y1 = firstTouch.pageY
				this.touch.anchorIndex = anchorIndex
				this.scrollTo(anchorIndex)
			},
			shortcutTouchMove(e) {
				let firstTouch = e.touches[0]
				this.touch.y2 = firstTouch.pageY
				let delta = (this.touch.y2 - this.touch.y1) / this.shortcutonce_height | 0
				/*
						|0相当于向下取整
						parseInt是因为this.touch.anchorIndex为string
						即getData(e.target, 'index')返回的值为字符串
				*/
				let anchorIndex = parseInt(this.touch.anchorIndex) + delta
				this.scrollTo(anchorIndex)
			},
			refresh() {
				this.$refs.listview.refresh()
			},
			scrollTo(index) {
				if (!index && index !== 0) {
					return
				}
				if (index < 0) {
					index = 0
				} else if (index > this.listHeight.length - 2) {
					index = this.listHeight.length - 2
				}
				this.scrollY = -this.listHeight[index]
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			calculateHeight() {
				this.listHeight = []
				const list = this.$refs.listGroup
				let height = 0
				this.listHeight.push(height)
				for (let i = 0; i < list.length; i++) {
					let item = list[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			},
			selectSinger(item) {
				console.log(1)
				this.$emit('select', item)
			}
		},
		created() {
			this.touch = {}
			this.listenScroll = true
			this.probeType = 3
			this.listHeight = []
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
.listView{
	height: 100%;
	position: relative;
	overflow: hidden;
	.list_group_panel{
		.list_group{
			.group_title{
				padding-left: 20px;
				height: 30px;
				line-height: 30px;
				font-size: $font-size-small;
				color: $color-text-l;
				background-color: $color-highlight-background;
			}
			.list_panel{
				padding-bottom: 20px;
				.list_once{
					display: flex;
					align-items:center;
					padding: 20px 0 0 30px;
					.once_img{
						width: 50px;
						height: 50px;
						border-radius: 50%;
						margin-right: 20px;
					}
					.once_info{
						h2{
							font-size: $font-size-medium;
							color: $color-text-l;
						}
					}
				}
			}
		}
	}
	.list_shortcut{
		position: absolute;
		z-index: 100;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		text-align: center;
		background-color: $color-background-d;
		border-radius: 20px;
		.shortcut_panel{
			.shortcut_once{
				padding: 1px 0;
				span{
					color: $color-text-l;
					font-size: $font-size-small;
				}
				&.active{
					span{
						color: $color-theme;
					}
				}
				&:nth-child(1){
					padding-top: 14px;
				}
				&:last-child{
					padding-bottom:14px;
				}
			}
		}
	}
	.list_fixed{
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		width: 100%;
		height: 30px;
		.fixed_title{
			padding-left: 20px;
			height: 30px;
			line-height: 30px;
			font-size: $font-size-small;
			color: $color-text-l;
			background-color: $color-highlight-background;
		}
	}
	.loading_container{
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
	}
}
</style>