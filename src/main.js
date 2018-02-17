// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// babel-polyfill 实现ES6的新方法如：set、map、promise等
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import axios from 'axios'
import lazyload from 'vue-lazyload'
import store from './store'
import '../node_modules/swiper/dist/css/swiper.min.css'
// eslint规则之一 这里应使用单引号
import './common/scss/index.scss'

fastclick.attach(document.body)
Vue.prototype.$axios = axios
Vue.use(lazyload, {
	loading: require('./common/image/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
