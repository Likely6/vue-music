<template>
  <div class="p_header">
    <div class="title">
      <span></span>
      <h1>Chicken Music</h1>
    </div>
    <router-link class="icon" taag="div" to="/user">
    	<span class="user icon-mine"></span>
    </router-link>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .p_header{
  	position: relative;
	  width: 100%;
	  height: 44px;
	  .title{
	  	height: 100%;
	  	display: flex;
	  	align-items: center;
	  	justify-content:center;
	  	flex:1;
		  span{
		  	display: inline-block;
		  	width: 28px;
		  	height: 30px;
		  	@include bg-image('images/logo');
		  	background-size: 28px 30px;
				background-repeat: no-repeat;
		  }
	    h1{
	    	margin-left: 8px;
	  	  	color: $color-theme;
	  	  	font-size: $font-size-large;
	    }
	  }
	  .icon{
	  	position: absolute;
	  	top: 0;
	  	right: 0;
	  	padding: 12px;
	  	height: 100%;
      .user{
      	font-size: 20px;
				color: $color-theme;
      }
	  }
  }
</style>