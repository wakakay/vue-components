<style lang="scss">

</style>
<template>
    <div class="ui-progress">
        <div class="ui-progress-title" v-if="title" v-text="title"></div>
        <slot name="start"></slot>
        <div class="ui-progress-content">
            <div class="ui-progress-runway" :style="{ height: barHeight + 'rem' }"></div>
            <div class="ui-progress-progress" :style="{ width: value + '%', height: barHeight + 'rem' }"></div>
        </div>
        <slot name="end"></slot>
    </div>
</template>

<script type="text/ecmascript-6">
  /**
   * v-progress
   * @module components/progress
   * @desc 进度条
   * @param {String} [title] - 标题
   * @param {Number} [value] - 进度条的值（%）
   * @param {Number} [barHeight] - 进度条的线宽（rem），默认是0.08
   * @param [start]	进度条左侧 DOM
   * @param [end] 进度条右侧 DOM
   * @example
   * <v-progress :value="60" :bar-height=".1" title="进度条"></v-progress>
   * <v-progress :value="40">
   *    <div slot="start">0%</div>
   *    <div slot="end">100%</div>
   * </v-progress>
   */
    export default {
        name: 'progress',
        props: {
            value: Number,
            title:String,
            barHeight: {
                type: Number,
                default: .08
            }
        }
    };
</script>
