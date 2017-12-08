import {
    USER_SIGNIN,
    USER_SIGNOUT
} from './mutation-types.js'

export default {
    [USER_SIGNIN]({commit}, user) {
        commit(USER_SIGNIN, user)
    },
    [USER_SIGNOUT]({commit}) {
        console.log(222)
        commit(USER_SIGNOUT)
    }
}
