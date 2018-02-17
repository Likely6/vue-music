<template>
  <div class="nav">
    <ul class="nav_panel">
      <router-link tag="li" to="/recommend">
        <span>推荐</span>
      </router-link>
      <router-link tag="li" to="/singer">
        <span>歌手</span>
      </router-link>
      <router-link tag="li" to="/rank">
        <span>排行</span>
      </router-link>
      <router-link tag="li" to="/search">
        <span>搜索</span>
      </router-link>
    </ul>
  </div>
</template>
<script>
  
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .nav {
    height: 44px;
    .nav_panel{
      height: 44px;
      line-height: 44px;
      display: flex;
      li{
        flex:1;
        text-align: center;
        color: $color-text-l;
        &.router-link-active{
          color: $color-theme;
          span{
            padding-bottom: 5px;
            border-bottom: 2px solid #{$color-theme};
          }
        }
      }
    }
  }
</style>