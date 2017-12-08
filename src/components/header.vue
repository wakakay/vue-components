<style lang="scss" rel="stylesheet/scss">

</style>

<template>
    <header class="module-header" :class="{ 'is-fixed': fixed }">
        <div class="module-header-content">
            <div class="module-header-button pull-left">
                <slot name="left"></slot>
            </div>
            
            <h1 v-text="title"></h1>
            
            <div class="module-header-button pull-right">
                <slot name="right"></slot>
            </div>
        </div>
    </header>
</template>

<script type="text/ecmascript-6">
    /**
     * v-header
     * @module components/header
     * @desc 顶部导航
     * @param {boolean} [fixed=false] - 固定顶部
     * @param {string} [title] - 标题
     * @param {slot} [left] - 显示在左侧区域
     * @param {slot} [right] - 显示在右侧区域
     *
     * @example
     * <v-header title="我是标题" fixed>
     *   <v-button slot="left" icon="back" @click="handleBack">返回</v-button>
     *   <v-button slot="right" icon="more"></v-button>
     * </v-header>
     */
    export default {
        name: 'header',
        props: {
            fixed: Boolean,
            title: String
        }
    }
</script>
