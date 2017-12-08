<style lang="scss">
    @import '../assets/styles/scss/function.scss';
  
    .ui-cell-search{
        height:px(78);padding:0 px(35);font-size:px(24);color:#1a1a1a;border-bottom:1px solid $border-color;
      
        [class^='icon-'] {
            margin-right:px(18);font-size:px(24);color:#e8e8e8;
        }
    }
</style>

<template>
    <div class="ui-cell-search" flex="cross:center" @click="handleClick">
        <slot name="icon">
            <i v-if="icon" :class="'icon-' + icon"></i>
        </slot>
        <span v-text="title"></span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'cell-search',
        props: {
            icon: String,
            title: String
        },
    
        mounted() {
            let self = this;
            // 如果有父组件，则将本身的属性传给父组件
            self.$parent && self.$parent.cellSearchCreated === 'function' && self.$parent.cellSearchCreated(this);
        },
        
        methods: {
            handleClick (event) {
                this.$emit('click', event);
            }
        }
    }
</script>
