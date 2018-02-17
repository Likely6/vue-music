<template>
  <div id="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <div class="wrap">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <v-player></v-player>
    </div>
  </div>
</template>

<script>
import header from './components/header/header'
import tab from './components/tab/tab'
import player from './components/player/player'
export default {
  name: 'app',
  components: {
    'v-header': header,
    'v-tab': tab,
    'v-player': player
  }
}
</script>

<style scoped lang="scss">
  @import "./common/scss/variable.scss";
  @import "./common/scss/mixin.scss";
  #app{
    background: #{$color-background};
    .wrap{
      position: fixed;
      top: 88px;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }
</style>
