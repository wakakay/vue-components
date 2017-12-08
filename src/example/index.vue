<style lang="scss">
    @import '../assets/styles/scss/function.scss';
    .list{
        display:block;
        padding:0 px(40);
        font-size:px(30);
        line-height:px(90);
        border-bottom:1px solid gray;
    }
</style>

<template>
    <div>
        <v-header title="JS Components" fixed></v-header>
        <router-link class="list" to="actionsheet">action-sheet</router-link>
        <router-link class="list" to="alert">alert-提示框</router-link>
        <router-link class="list" to="button">button-按钮</router-link>
        <router-link class="list" to="header">header-头部</router-link>
        <router-link class="list" to="indicator">indicator</router-link>
        <router-link class="list" to="progress">progress-进度条</router-link>
        <router-link class="list" to="search">search-搜索</router-link>
        <router-link class="list" to="cell-swipe">cell-swipe-列表滑块</router-link>
        <router-link class="list" to="list-group">list-group-文本列表</router-link>
        <router-link class="list" to="thumb-group">thumb-group-图文列表</router-link>
        <router-link class="list" to="infinite-scroll">infinite-scroll</router-link>
        <router-link class="list" to="slide">slide-幻灯片</router-link>
        <router-link class="list" to="toast">toast-弹窗提示</router-link>
    </div>
</template>

<script>

</script>
