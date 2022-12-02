import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 引入echarts

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 时间格式化插件
import moment from 'moment'
// dateFormat 过滤器名字
Vue.filter('dateFormat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

import axios from '@/plugin/axios'
Vue.prototype.$axios = axios









Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
