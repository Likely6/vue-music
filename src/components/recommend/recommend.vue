<template>
  <div class="recommend" ref="recommend">
  	<v-scroll :data="songList" ref="scroll">
  		<div class="slider">
	      <v-slider :slider="slider">
	      		<!-- 单插槽 -->
	      		<a class="swiper-slide" v-for="(item,index) in slider" @click="jumpLink(item.linkUrl)">
		   			<img @load="loadImage" :src="item.picUrl" alt="">
		   		</a>
	      </v-slider>
	    </div>
	    <div class="song_panel">
	      <h1 class="song_title">热门歌单推荐</h1>
	      <div class="song_list" id="">
	        <ul class="list_panel">
				<li @click="selectItem(item)" class="list_once" v-for="(item,index) in songList">
					<div class="img_panel">
						<img v-lazy="item.imgurl" alt="">
					</div>
					<div class="text_panel">
						<h1 class="text_title" v-html="item.creator.name"></h1>
						<p class="text_breif" v-html="item.dissname"></p>
					</div>
				</li>
	        </ul>
	      </div>
    	</div>
  	</v-scroll>
  	<router-view></router-view>
  	<div class="loading_panel" v-show="!songList.length">
  		<v-loading></v-loading>
  	</div>
  </div>
</template>
<script>
import {getRecommend, getDiscList} from '../../api/recommend.js'
import {ERR_OK} from '../../api/config.js'
import slider from '../../base/slider/slider'
import scroll from '../../base/scroll/scroll'
import loading from '../../base/loading/loading'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'
export default {
	mixins: [playlistMixin],
	data() {
		return {
			slider: [],
			songList: [],
			checkImage: true
		}
	},
	components: {
		'v-slider': slider,
		'v-scroll': scroll,
		'v-loading': loading
	},
	methods: {
		getRecommend() {
			getRecommend()
				.then((res) => {
					if (res.code === ERR_OK) {
						console.log(res.data)
						this.slider = res.data.slider
					}
				})
		},
		getDiscList() {
			getDiscList()
				.then((res) => {
					if (res.code === ERR_OK) {
						this.songList = res.data.list
					}
				})
		},
		// slide第一张图加载完成后刷新scroll
		loadImage() {
			if (this.checkImage) {
				this.checkImage = false
				this.$refs.scroll.refresh()
			}
		},
		jumpLink(url) {
			window.location.href = url
		},
		selectItem(item) {
			this.$router.push({
				path: `/recommend/${item.dissid}`
			})
			this.setDisc(item)
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.recommend.style.paddingBottom = bottom
			this.$refs.scroll.refresh()
			console.log(this.$refs.scroll)
		},
		...mapMutations({
			setDisc: 'SET_DISC'
		})
	},
	mounted() {
		this.getRecommend()
		this.getDiscList()
	}
}
</script>
<style lang="scss" scoped>
	@import '../../common/scss/variable.scss';
  .recommend{
  	height: 100%;
  	.slider{

  	}
  	.song_panel{
  		.song_title{
  			text-align: center;
				height: 65px;
				line-height: 65px;
				font-size: $font-size-medium;
				color: $color-theme;
  		}
  		.song_list{
  			padding: 0 16px 1px;
  			.list_panel{
  				.list_once{
  					display: flex;
  					margin-bottom: 18px;
  					align-items:center;
						.img_panel{
							margin-right: 18px;
							img{
								width: 60px;
								height: 60px;
							}
						}
						.text_panel{
							.text_title{
								font-size: $font-size-medium;
								color: $color-text;
								margin-bottom: 12px;
							}
							.text_breif{
								font-size: $font-size-medium;
								color: $color-text-d;
								line-height: 1.4em;
							}
						}
  				}
  			}
  		}
  	}
  	.loading_panel{
  		position: absolute;
  		left: 0;
  		top: 50%;
  		transform: translateY(-50%);
  		width: 100%;
  	}
  }
</style>