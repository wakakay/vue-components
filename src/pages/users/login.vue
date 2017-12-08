<style lang="scss" scoped>
  header{height:40px;background-color:#000;font-size:16px;color:#fff;text-align:center;line-height:40px;}
  .login {
    padding: 50px;
    text-align: center;
    .line {
      padding: 5px;
      input {
        padding: 0 10px;
        line-height: 28px;
      }
    }
    button {
      padding: 0 20px;
      margin-top: 20px;
      line-height: 28px;
    }
  }
</style>

<template>
    <div>
        <header>登录</header>

        <form class="login">
            <div class="line">

                <input type="number" placeholder="输入你的id" v-model="userInfo.id">
            </div>
            <div class="line">

                <input type="text" placeholder="输入你的用户名" v-model="userInfo.name">
            </div>
            <button type="button" @click="getLogin()">登录</button>
        </form>
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        userInfo: {
          id: 33,
          name: 'names'
        }
      }
    },
    methods: {
      ...mapMutations(['USER_SIGNIN']),
      getLogin () {
        if (!this.userInfo.id || !this.userInfo.name) return
        this.USER_SIGNIN(this.userInfo)
        this.$router.replace({ path: '/user-info' })
      }
    }
  }
</script>
