<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    
    .ui-cell-title{
        height:px(56);padding:0 px(20) 0 px(10);font-size:px(28);color:#999;line-height:px(56);border-bottom:2px solid $border-color;
        [class^="icon-"]{
            display:block;width:px(40);font-size:px(26);
        }
        .ui-button{
            width:auto;height:px(40);padding:0 px(15);float:right;line-height:px(40);
            .ui-button-icon{color:#999 !important;}
            [class^="icon-"]{font-size:px(30);}
            &.ui-button-default{background:none;box-shadow:none;}
        }
    }
</style>

<template>
    <div class="ui-cell-title" flex="main:justify cross:center">
        <div flex="">
            <slot name="icon" flex-box="0">
                <i v-if="icon" px
            </slot>
            <span v-text="title" flex-box="1"></span>
        </div>
    
        <slot name="button"></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     * v-title
     * @module components/cell-title
     * @desc 文本标题
     * @param {icon} [String] - 字体图标（不自动补全'icon-'）
     * @param {title} [String] - 文本文案
     *
     * @example
     * <v-title></v-title>
     */
    export default {
        name: 'cell-title',
        props: {
            icon: String,
            title: String
        },
        
        methods: {
        
        }
    }
</script>
