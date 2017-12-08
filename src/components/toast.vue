<style lang="scss">

</style>
<template>
    <transition name="fade">
        <div class="ui-toast" v-if="visible" :class="customClass">
            <slot name="icon">
                <i v-if="icon" :class="'icon-' + icon"></i>
            </slot>
            <span class="ui-toast-text" :style="{ 'padding': icon === '' ? '0' : '.26rem' }">{{ message }}</span>
        </div>
    </transition>
</template>

<script type="text/babel">
  /**
   * v-toast
   * @module components/toast
   * @desc 按钮
   * @param {string} [message]- 文本内容
   * @param {String} [position=middle] - toast组件的位置,默认middle,可选top,middle,bottom
   * @param {Number} [duration] - 持续时间（毫秒），若为 -1 则不会自动关闭,默认3000
   * @param {string} [className] - Toast 的类名,可以为其添加样式
   * @param {string} [icon] - 图标，传入字体图标的名称不包含（icon-会自动带上）
   * @example
   * toast('提示');
   * toast({
   *   message: '提示',
   *   position: 'bottom',
   *   duration: 5000
   * });
   */

  export default {
      props: {
          message: String,
          className: {
              type: String,
              default: ''
          },
          position: {
              type: String,
              default: 'middle',
              validator(value) {
                  return [
                      'top',
                      'middle',
                      'bottom'
                  ].indexOf(value) > -1
              }
          },
          icon: {
              type: String,
              default: ''
          }
      },
    
      data() {
          return {
              visible: false
          };
      },
    
      computed: {
          customClass() {
              var classes = [];
              switch (this.position) {
                  case 'top':
                      classes.push('placetop');
                      break;
                  case 'bottom':
                      classes.push('placebottom');
                      break;
                  default:
                      classes.push('placemiddle');
              }
              classes.push(this.className);
              return classes.join(' ');
          }
      }
  };
</script>

