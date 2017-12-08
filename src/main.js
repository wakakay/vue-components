// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router' // 路由管理
import VueKeepScrollPosition from 'vue-keep-scroll-position'
import store from './store/' // 状态管理
import {routerMode} from './config/env' // 配置编译环境和线上环境之间的切换
import * as components from './components/' // 加载公共组件
// 公共插件
import './config/flex'
import FastClick from 'fastclick'
import underscore from 'underscore'
// Vue.prototype._ = underscore;
// 公共样式
import './assets/styles/common.css'
import './assets/styles/scss/common.scss'
import './assets/styles/iconfont/iconfont.css'

global._ = underscore

FastClick.attach(document.body) // 消除以移动端300ms延时

Vue.config.productionTip = false

Object.keys(components).forEach((key) => {
    let name = key.replace(/(\w)/, (v) => v.toUpperCase()) // 首字母大写
    Vue.component(`v${name}`, components[key])
})

/* eslint-disable no-new */
Vue.use(VueRouter)
Vue.use(VueKeepScrollPosition)
const router = new VueRouter({
    routes,
    mode: routerMode,
    strict: process.env.NODE_ENV !== 'production',
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    suppressTransitionError: true,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop
            }
            return {x: 0, y: to.meta.savedPosition || 0}
        }
    }
})

new Vue({
    router,
    store
}).$mount('#app')
