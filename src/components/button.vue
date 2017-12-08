<style lang="scss" rel="stylesheet/scss">

</style>

<template>
    <button class="ui-button"
            :type="nativeType"
            :class="['ui-button-' + type, 'ui-button-' + size, {
              'is-disabled': disabled,
              'is-plain': plain
            }]"
            @click="handleClick"
            :disabled="disabled">
    <span class="ui-button-icon" v-if="icon || $slots.icon">
        <slot name="icon">
            <i v-if="icon" :class="'icon-' + icon"></i>
        </slot>
    </span>
        <label class="ui-button-text">
            <slot></slot>
        </label>
    </button>
</template>

<script type="text/ecmascript-6">
    /**
     * v-button
     * @module components/button
     * @desc 按钮
     * @param {string} [type=default] - 显示类型，接受 default, primary, danger
     * @param {boolean} [disabled=false] - 禁用
     * @param {boolean} [plain=false] - 幽灵按钮（无背景）
     * @param {string} [size=normal] - 尺寸，接受 normal, small, large
     * @param {string} [native-type] - 原生 type 属性
     * @param {string} [icon] - 图标，传入字体图标的名称不包含（icon-会自动带上）
     * @param {slot} - 显示文本
     * @param {slot} [icon] 显示图标
     *
     * @example
     * <v-button size="large" icon="back" type="primary">按钮</v-button>
     */
    export default {
        name: 'button',
        methods: {
            handleClick(evt) {
                this.$emit('click', evt)
            }
        },
        props: {
            icon: String,
            disabled: Boolean,
            nativeType: String,
            plain: Boolean,
            type: {
                type: String,
                default: 'default',
                validator(value) {
                    return [
                        'default',
                        'danger',
                        'primary'
                    ].indexOf(value) > -1
                }
            },
            size: {
                type: String,
                default: 'normal',
                validator(value) {
                    return [
                        'small',
                        'normal',
                        'large'
                    ].indexOf(value) > -1
                }
            }
        }
    }
</script>
