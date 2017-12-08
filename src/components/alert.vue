<style lang="scss">

</style>

<template>
  <transition name="fade">
    <div class="ui-alert" :class="['ui-alert-' + type]" v-if="show">
      <slot name="icon">
        <i v-if="icon" :class="['icon-' + icon,'ui-alert-icon']"></i>
      </slot>
      <span class="ui-alert-text">
        <slot>{{title}}</slot>
      </span>
      <i v-if="closeable" class="icon-close ui-alert-close" @click="handleClick"></i>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * @module components/alert
   * @desc 提示框
   * @param {string} [type=default] - 显示类型，接受 default, success, error, warning
   * @param {string} [icon] - 图标，传入字体图标的名称不包含（icon-会自动带上）
   * @param {slot} - 显示文本
   * @param {slot} [icon] 显示图标
   * @param click 点击关闭x触发事件
   * @example
   * <v-alert type="success">提示文案</v-alert>
   */

  export default {
    name: 'alert',
    props:{
      type: {
        type: String,
        default: 'default',
        validator (value) {
          return [
              'default',
              'success',
              'error',
              'warning'
            ].indexOf(value) > -1
        }
      },
      title:{
        type:String,
        default:'提示文案'
      },
      closeable:{
        type:Boolean,
        default:true
      },
      icon:String
    },
    data(){
      return {
        show:true
      }
    },
    methods: {
      handleClick (evt) {
        this.show = false;
        this.$emit('click', evt);
      }
    }
  }
</script>
