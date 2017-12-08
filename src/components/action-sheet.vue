<style lang="scss">

</style>
<template>
    <div v-show="show" class="ui-actionsheet">
        <div class="ui-actionsheet-list" :class="{'bounce-up':show}">
            <ul :style="{ 'margin-bottom': cancelText ? '.1rem' : '0' }">
                <li
                    v-for="( item, index ) in actions"
                    class="ui-actionsheet-listitem"
                    @click="itemClick(item, index)">{{ item.name }}</li>
            </ul>
            <a class="ui-actionsheet-button"
                @click="cancelClick"
                v-if="cancelText">{{ cancelText }}</a>
        </div>
        <div class="ui-actionsheet-mask" @click="maskClick"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     * v-action-sheet
     * @module components/action-sheet
     * @desc 操作表
     * @param {Array} [actions]- 菜单项数组
     * @param {String} [cancelText] - 不设置，则不显示取消按钮
     * @param {Boolean} [maskClose] - 是否可以通过点击 mask 层来关闭 actionsheet，默认是true
     * @example
     * <div @click="sheetVisible = true">点击显示actionsheet</div>
     * <v-action-sheet
     *    :actions="actions"
     *    :show.sync="sheetVisible">
     * </v-action-sheet>
     * <v-action-sheet
     *    :actions="actions"
     *    :show.sync="sheetVisible"
     *    cancel-text="取消"
     *    :mask-close="false">
     * </v-action-sheet>
     */

  export default {
      name: 'action-sheet',
      props: {
          maskClose: {
              default: true
          },
          cancelText: {
              type: String,
              default: ''
          },
          actions: {
              type: Array,
              default: () => []
          },
          show:{
              type:Boolean,
              default:false
          }
      },
      methods: {
          cancelClick(){
              this.$emit("update:show", !this.show);
          },
          maskClick(){
              this.maskClose?this.$emit("update:show", !this.show):"";
          },
          itemClick(item, index) {
              if (item.method && typeof item.method === "function") {
                  item.method(item, index);
              }
              this.$emit("update:show", !this.show);
          }
      }
  };
</script>
