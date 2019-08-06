// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import VueCropper from 'vue-cropper'
import utils from './utils'
import './http'

import VueUeditorWrap from "vue-ueditor-wrap";
Vue.component('vue-ueditor-wrap', VueUeditorWrap)
// // 富文本需要的文件
// import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.all.min.js'
// import '../static/UE/lang/zh-cn/zh-cn.js'　　　
// import '../static/UE/ueditor.parse.min.js'


// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(VueCropper)
// Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(ElementUI);
// 设置语言
Vue.use(ElementUI, { locale })

//Vue.prototype.$baseUrl=utils.getUrlKey();//打包放出
Vue.prototype.$baseUrl = "http://192.168.2.100:8080/";//打包屏蔽
// Vue.prototype.$baseUrl = "https://test.heidouinfo.com";//打包屏蔽
Vue.prototype.$uploadUrl = "http://file.heidouinfo.com/";//文件服务器地址
/* eslint-disable no-new */





router.beforeEach((to, from, next) => {
  if(to.name == "passWord"){
    next()
  }else if(to.name == "login"){
    next()
  }else if(sessionStorage.getItem("userId")){
    next()
  }else{
    next({path:"login"})
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})


