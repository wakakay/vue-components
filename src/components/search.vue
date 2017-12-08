<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    .module-search{
        width:100%;height:100%;background-color:#fff;overflow:hidden;
        .ui-search-box{
            width:100%;height:px(80);padding:px(10) px(20);
            .ui-search-input{
                padding:px(12) px(16);background:#f1f1f1;border-radius:px(80);
                [class^="icon-"]{
                    font-size:px(30);color:#aaa;
                }
                [type="search"]{
                    padding:0 px(12);background:transparent;font-size:px(26);color:#aaa;caret-color:#26a2ff;border:0;
                }
            }
            .ui-search-cancel{
                width:px(78);margin-left:px(18);
            }
        }

        &.add-fixed{width:100%;position:fixed;left:0;top:0;z-index:$z-index-highest;}
        &.add-fixed{-webkit-animation-name:opacity;animation-name:opacity;
             -webkit-animation-duration:.3s;animation-duration:.3s;-webkit-animation-fill-mode:both;animation-fill-mode: both;opacity: .5;}
        &.add-fixed .ui-search-box{
             border-bottom:1px solid $border-color;
             animation:translateY .2s ease-out 1;-webkit-animation:translateY .2s ease-out 1;
             -webkit-animation-fill-mode:both;animation-fill-mode: both;
         }
      
        .ui-keyword-list{
            width:100%;height:100%;background-color:#fff;position:absolute;left:0;top:px(80);overflow:hidden;z-index:$z-index-highest;
        }
    
        .ui-search-list-box{
            margin:px(30) 0 0 px(30);overflow:hidden;
        }
    }
    
    @-webkit-keyframes opacity {
        0% {opacity: .5;}
        100% {opacity: 1;}
    }
    @keyframes opacity {
        0% {opacity: .5;}
        100% {opacity: 1;}
    }
    @-webkit-keyframes translateY {
        100% {transform: translateY(0);-webkit-transform: translateY(0);}
    }
    @keyframes translateY {
        100% {transform: translateY(0);-webkit-transform: translateY(0);}
    }
</style>

<template>
    <div class="module-search">
        <!-- 搜索框 -->
        <div class="ui-search-box" ref="searchBox" flex="dir:left box:last">
            <form action="javascript:return true;" class="ui-search-input" flex="dir:left box:first">
                <i class="icon-search" flex="cross:center"></i>
                <input type="search" autocomplete="off" autocorrect="off" ref="input"
                       v-model="currentValue" :placeholder="placeholder"
                       @search="handleSearch();" @click="getFocus(this);" />
            </form>
            <div class="ui-search-cancel"
                flex="main:center cross:center"
                v-show="isShowCancel"
                v-text="cancelText"
                @click="getCancel();"></div>
        </div>
        
        <!-- 关键字列表 -->
        <div class="ui-keyword-list" v-show="isFilterKeyword" v-if="isShowStart">
            <slot name="filterList"></slot>
        </div>
        
        <!-- 搜索记录 -->
        <div class="ui-search-list-box" v-show="isShowHistroy && isShowStart">
            <slot name="historyTitle"></slot>
            <slot name="history"></slot>
        </div>
       
        <!-- 热门搜索 -->
        <div class="ui-search-list-box" v-if="isShowHot && isShowStart">
            <slot name="hotTitle"></slot>
            <slot name="hot"></slot>
        </div >
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     * v-slide
     * @module components/slide
     * @param {value} [String] - 搜索框的默认值---【''】
     * @param {placeholder} [String] - 搜索框提示语---【请输入关键字...】
     * @param {autofocus} [Boolean] - 是否自动对焦---【true】
     * @param {cancelText} [String] - 取消按钮的文本---【取消】
     * @param {isShowHistroy} [Number] - 是否显示历史记录，由列表的个数---【0】
     * @param {isShowHot} [Number] - 是否显示推荐搜索，由列表的个数---【0】
     * @param {isFilterKeyword} [Number] - 是否有关键字过滤列表--【0】
     *
     * @example
     * <v-search
     *   <v-cell-search></v-cell-search>
     *   <v-cell-title slot="historyTitle"></v-cell-title>
     *   <v-cell-text slot="history"></v-cell-text>
     *
     *   <v-cell-title slot="hotTitle"></v-cell-title>
     *   <v-cell-text slot="hot"></v-cell-text>
     * </v-search>
     */
    import {once, addClass, removeClass} from '../config/uitls'

    export default {
        name: 'search',
    
        props: {
            value: {
                type: String
            },
        
            placeholder: {
                type: String,
                default: '请输入关键字...'
            },
        
            autofocus: {
                type: Boolean,
                default: true
            },
        
            cancelText: {
                type: String,
                default: '取消'
            },
        
            isShowHistroy: {
                type: Number,
                default: 0
            },
        
            isShowHot: {
                type: Number,
                default: 0
            },
        
            isFilterKeyword: {
                type: Number,
                default: 0
            }
        },
    
        data() {
            return {
                currentValue: this.value, // 当前搜索框的值
                isShowCancel: false,  // 是否显示取消按钮
                isShowStart: false   // 是否开始显示其他盒子
            }
        },
    
        mounted() {
            let self = this;
            // 屏幕的可视区域高度
            self.winHeight = document.body.clientHeight;
            // 搜索框的offsetTop
            self.offsetTop = self.$refs.searchBox.offsetTop;
        },
    
        watch: {
            // 监听搜索的值
            currentValue(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.$emit('filterKeyword', this.currentValue);
                }
            }
        },
    
        methods: {
            cellSearchCreated(info) {
                let self = this;
                // 对cell-search组件绑定事件
                once(info.$el, 'click', _ => {
                    self.getCancel();
                })
            },
        
            cellTextCreated(info) {
                let self = this;
                // 对cell-text组件绑定事件
                once(info.$el, 'click', _ => {
                    self.getCancel();
                })
            },
        
            // 搜索框
            getFocus($self) {
                let self = this;
                self.isShowCancel = true;
                document.body.scrollTop = 0;
                
                addClass(self.$el, 'add-fixed');
                self.__translateY({ele: self.$refs.searchBox, value: self.offsetTop}, _ => {
                    self.isShowStart = true;
                    self.autofocus && self.$refs.input.focus();
                });
            },
        
            // 取消按钮
            getCancel() {
                let self = this;
                self.isShowCancel = false;
                self.currentValue = '';
                self.__translateY({ele: self.$refs.searchBox, value: 0});
                self.isShowStart = false;
                removeClass(self.$el, 'add-fixed');
            },
        
            // 搜索
            handleSearch() {
                let self = this;
                if (self.currentValue !== '') {
                    self.$emit('handleSearch', self.currentValue);
                    self.getCancel();
                }
            },
        
            /**
             * 动画效果
             * @param obj {ele: 被修改对象, value: 修改的值}
             * @param fnc 回调函数
             * @private
             */
            __translateY(obj, fnc) {
                obj.ele.style.webkitTransform = 'translateY(' + obj.value + 'px)';
                obj.ele.style.transform = 'translateY(' + obj.value + 'px)';
                if (typeof fnc === 'function') {
                    // 绑定监听CSS3是否结束
                    once(obj.ele, 'animationend', _ => {
                        fnc();
                    })
                }
            }
        }
    }
</script>
