<style lang="scss">

</style>
<template>
    <transition name="fade">
        <div class="ui-indicator" v-show="visible">
            <div class="ui-indicator-wrapper">
                <slot name="icon">
                    <i :class="'icon-' + icon"></i>
                </slot>
                <span class="ui-indicator-text" v-show="message">{{ message }}</span>
            </div>
            <div class="ui-indicator-mask" @touchmove.stop.prevent></div>
        </div>
    </transition>
</template>

<script type="text/babel">
  /**
   * v-toast
   * @module components/toast
   * @desc 加载
   * @param {string} [message]- 文本内容
   * @param {string} [icon] - 图标，传入字体图标的名称不包含（icon-会自动带上）
   * @example
   * indicator.open();
   * indicator.open('加载中');
   * indicator.open({
   *   message: '加载中',
   *   icon: 'loading'
   * });
   * indicator.close();
   */
  export default {
      data() {
          return {
              visible: false
          };
      },
      props: {
          message: String,
          icon: String
      }
  };
</script>
