<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';

    .ui-slide-item{
        width:100%;height:100%;transform:translateX(-100%);position: absolute;display:none;
        &.active{
           display:block;transform:none;
        }
    }
</style>

<template>
    <div class="ui-slide-item">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'slide-item',
        
        props: {
            title: {
                type: String
            }
        },
        mounted() {
            this.$parent && this.$parent.slideItemCreated(this)
        },
        
        destroyed() {
            this.$parent && this.$parent.slideItemDestroyed(this)
        }
    }
</script>
