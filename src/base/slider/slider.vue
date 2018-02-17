<template>
  <div class="swiper-container swiper">
  	<ul class="swiper-wrapper swiper_panel">
	   	<slot></slot>
 		</ul>
 		<div class="swiper-pagination"></div>
  </div>
</template>
<script>
	import Swiper from 'swiper'
	let mySwiper = ''
	// 默认配置
	let slideOptioin = {
		pagination: {
      el: '.swiper-pagination'
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
		speed: 600,
		loop: true
	}
	export default {
		props: {
			options: {
				type: Object,
				default: function() {
					return slideOptioin
				}
			},
			slider: Array
		},
		watch: {
			slider() {
				this.init()
			}
		},
		methods: {
			init() {
				let _this = this
				if (!mySwiper && this.slider.length > 0) {
					this.$nextTick(() => {
						// 与默认配置合并
						let options = Object.assign({}, slideOptioin, _this.options)
						mySwiper = new Swiper('.swiper-container', options)
					})
				}
			}
		},
		mounted() {
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
	.swiper{
		.swiper_panel{
			img{
				width: 100%;
			}
		}
	}
</style>