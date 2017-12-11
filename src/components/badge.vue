<style lang="scss">

</style>

<template>
    <span
        class="ui-badge"
        :style="{ backgroundColor: color }"
        :class="['ui-badge-' + type, 'ui-badge-' + size]">
        <slot></slot>
    </span>
</template>

<script type="text/ecmascript-6">
  /**
   * v-badge
   * @module components/badge
   * @desc 徽章
   * @param {string} [type=primary] 组件样式，可选 primary, error, success, warning
   * @param {string} [color] - 传入颜色值
   * @param {string} [size=normal] - 尺寸，接受 normal, small, large
   *
   * @example
   * <v-badge color="error">错误</v-badge>
   * <v-badge color="#333">30</v-badge>
   */
    export default {
        name: 'v-badge',
        props: {
            color: String,
            type: {
                type: String,
                default: 'primary'
            },
            size: {
                type: String,
                default: 'normal'
            }
        }
    };
</script>
