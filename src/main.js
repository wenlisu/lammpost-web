import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import mixin from 'util/mixin';
import Preview from '@/components/preview/index.js';

require('!style-loader!css-loader!less-loader!common/css/reset.less') // 重置全局默认样式
require('!style-loader!css-loader!less-loader!common/css/animated.less') // 动画样式
require('!style-loader!css-loader!less-loader!common/css/resetElementUi.less') // 重置饿了么某部分样式

require('!style-loader!css-loader!less-loader!../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css') // 引入富文本样式

require('util/prototype')
Vue.use(Preview);
// ZyKWZjnDOAUE4WEq9Qu9SMT4b9v8iUGM
// Vue.use(BaiduMap, {
//   ak: 'ZyKWZjnDOAUE4WEq9Qu9SMT4b9v8iUGM'
// });
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts
Vue.mixin(mixin)

new Vue({
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>'
  }).mount('#app')
