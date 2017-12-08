import {sessionStorage} from '../config/session'
import {
    USER_SIGNIN,
    USER_SIGNOUT
} from './mutation-types.js'

export default {
    // 登录成功
    [USER_SIGNIN](state, user) {
        state.isLogin = true
        state.userInfo = user
        sessionStorage.setItem('loginStatus', state.isLogin)
        sessionStorage.setItem('userInfo', state.userInfo)
        console.log(11, state, user)
    },
    // 退出登录
    [USER_SIGNOUT](state, user) {
        state.isLogin = false
        state.userInfo = {}
        sessionStorage.removeItem('loginStatus')
        sessionStorage.removeItem('userInfo')
        console.log(22, state)
    }
}
