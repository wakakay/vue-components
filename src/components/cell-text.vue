<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    
    .ui-cell-text{
        height:px(85);padding-left:px(10);font-size:px(28);color:#000;line-height:px(85);border-right:px(1) solid #e6e6e6;border-bottom:px(1) solid #e6e6e6;overflow:hidden;
        &:active{ background:$active-background-color;}
        &[column="1"] {width:100%;clear:both;border-right:none;}
        &[column="2"] {width:50%;float:left;}
        &[column="3"] {width:33.33%;float:left;}
        &[column="4"] {width:25%;float:left;}
        &[column="5"] {width:20%;float:left;}
        
        &.is-grade:nth-of-type(1)::first-letter{color:#ff443f;}
        &.is-grade:nth-of-type(2)::first-letter{color:#ff903b;}
        &.is-grade:nth-of-type(3)::first-letter{color:#ffc535;}
    }
</style>

<template>
	<section class="ui-cell-text"
             :column="column" :class="{'is-grade': numbering&&isGrade}"
             @click="handleClick">
        <slot name="icon">
            <i v-if="icon" :class="'icon-' + icon"></i>
        </slot>
        
        <span v-text="numbering + title"></span>
    </section>
</template>

<script type="text/ecmascript-6">
    /**
     * v-cell-text
     * @module components/slide
     * @desc moren
     * @param {icon} [String] - 字体图标（不自动补全'icon-'）
     * @param {title} [String] - 文本文案
     * @param {numbering} [String] - 编号(如1. 一)
     * @param {column} [Number] - 每行显示一个--【1】
     * @param {isGrade} [Boolean] - 是否显示编号的等级(只有当编号有值的情况下，只对前三个编号的颜色变化)--【false】
     *
     * @example
     * <v-cell-text></v-cell-text>
     */
    export default {
        name: 'cell-text',
        props: {
            icon: String,
            title: String,
            numbering: {
                type: String,
                default: ''
            },
            
            column: {
                type: Number,
                default: 1
            },
            
            isGrade: {
                type: Boolean,
                default: false
            }
        },
    
        mounted() {
            let self = this;
            // 如果有父组件，则将本身的属性传给父组件
            self.$parent && self.$parent.cellTextCreated === 'function' && self.$parent.cellTextCreated(this);
        },
        
        methods: {
            handleClick (event) {
                this.$emit('click', event);
            }
        }
    }
</script>
