<template>
	<div id="scrollWrapper" ref="scrollWrapper">
		<div class="scroll_panel">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	let myScroll
	export default {
		props: {
			data: {

			},
			listenScroll: {
				type: Boolean,
				default: false
			},
			probeType: {
				type: Number,
				default: 1
			},
			pullup: {
				type: Boolean,
				default: false
			},
			beforeScroll: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				myScroll: ''
			}
		},
		watch: {
			data() {
				this.init()
			}
		},
		methods: {
			init() {
				let _this = this
				if (!this.myScroll && this.data.length > 0) {
					this.$nextTick(() => {
						_this.myScroll = new BScroll(this.$refs.scrollWrapper, {
							probeType: this.probeType,
							click: true
						})
						if (_this.listenScroll) {
							_this.myScroll.on('scroll', (pos) => {
								_this.$emit('scroll', pos)
							})
						}
						if (this.pullup) {
							this.myScroll.on('scrollEnd', () => {
								if (this.myScroll.y <= this.myScroll.maxScrollY + 50) {
									this.$emit('scrollToEnd')
								}
							})
						}
						if (this.beforeScroll) {
							this.myScroll.on('beforeScrollStart', () => {
								this.$emit('beforeScroll')
							})
						}
					})
				}
			},
			refresh() {
				this.myScroll && this.myScroll.refresh()
			},
			scrollTo() {
				this.myScroll && this.myScroll.scrollTo.apply(this.myScroll, arguments)
			},
			scrollToElement() {
				this.myScroll && this.myScroll.scrollToElement.apply(this.myScroll, arguments)
			}
		},
		mounted() {
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
	#scrollWrapper{
		height: 100%;
		overflow: hidden;
	}
</style>