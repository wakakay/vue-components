<style lang="scss">

</style>

<template>
    <label class="ui-switch">
        <input class="ui-switch-input" :disabled="disabled" @change="$emit('change', currentValue)" type="checkbox" v-model="currentValue">
        <span class="ui-switch-core"></span>
        <div class="ui-switch-label"><slot></slot></div>
    </label>
</template>

<script type="text/ecmascript-6">
    /**
     * v-switch
     * @module components/switch
     * @desc 切换按钮
     * @param {boolean} [value] - 绑定值，支持双向绑定
     * @param {slot} - 显示内容
     *
     * @example
     * <v-switch v-model="value"></v-switch>
     */
    export default {
        name: 'v-switch',
        props: {
            value: Boolean,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            currentValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            }
        }
    };
</script>
