<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    
    .ui-list-group{
        height:px(110);margin-left:px(40);padding-right:px(40);border-bottom:1px solid $border-color;
        &:active{ background:$active-background-color;}
        .cell-left{
            font-size:px(30);color:$color-black;
            [class^='icon-']{
                padding-right:px(16);color:$color-brown;
            }
        }
        .cell-right{
            font-size:px(24);color:$color-medium-grey;
            [class^='icon-']{
                padding-left:px(10);font-size:px(24);color:$color-light-grey;
            }
        }
    }
</style>

<template>
    <router-link :to="getHref" class="ui-list-group" flex="main:justify">
        <span class="cell-left" flex="cross:center">
            <slot name="icon">
                <i :class="'icon-' + icon"></i>
            </slot>
    
            <span v-text="title"></span>
        </span>
        
        <span class="cell-right" flex="cross:center">
            <span v-text="subTitle" :style="colorStyle"></span>
            <i class="icon-details"></i>
        </span>
    </router-link>
</template>

<script type="text/ecmascript-6">
    /**
     * v-list-group
     * @module components/list-group
     * @desc 文本列表
     * @param {toLink} [String] - 路由链接的名称---【''】
     * @param {isLink} [Boolean] - 是否是链接---【true】 如果有父组件有对链接进行控制的话，必须设置为false
     * @param {icon} [String] - 字体图标---【''】
     * @param {title} [String] - 左边文字---【''】
     * @param {subTitle} [String] - 右边位子---【''】
     * @param {colorStyle} [String] - 副标题的样式---【''】
     *
     * @example
     * <v-list-group></v-list-group>
     */
    export default {
        name: 'list-group',
        
        props: {
            toLink: String,
            isLink: {
                type: Boolean,
                default: true
            },
            icon: String,
            title: String,
            subTitle: String,
            colorStyle: String
        },
    
        computed: {
            // 超链接处理
            getHref() {
                let self = this;
                // 不做链接获取没有链接地址则取消超链接
                if (!self.isLink || !self.toLink) return '';
                if (self.toLink && self.$router) {
                    let resolved = self.$router.match(self.toLink);
                    if (!resolved.matched.length) {
                        return self.toLink;
                    }
                    return resolved.path;
                }
                return self.toLink;
            }
        },
        
        methods: {
        
        }
    }
</script>
