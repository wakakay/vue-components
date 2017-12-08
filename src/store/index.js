import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import {sessionStorage} from '../config/session'

Vue.use(Vuex)

const state = {
    isLogin: sessionStorage.getItem('loginStatus') || false,   // 是否登录
    userInfo: sessionStorage.getItem('userInfo') || {}      // 登录成功后的信息
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})
