<script src="../../../BPMS/raw/js/edit-cart/model/CartExcelModel.js"></script>
<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    
    .ui-cell-swipe {
        min-height: px(80);height:100%;position: relative;
    
        .ui-content {
            width: 100%;
            height: 100%;
            background-color:#fff;
            border-bottom: 1px solid $border-color;
            transform: translate3d(0, 0, 0);
            position: absolute;
            left: 0;
            top: 0;
            z-index: $z-index-slightly;
            transition: transform .2s ease-out;
            -webkit-transition: transform .2s ease-out;
            .cell-text {
                height:100%;padding:0 px(40)
            }
        }
        
        .ui-buttons-group {
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            z-index: $z-index-normal;
            ul{height:100%;
                li{
                    height:100%;padding:0 px(20);float:left;color:#fff;
                    &.gray{background-color:$swipe-button-color-gray;}
                    &.yellow{background-color:$swipe-button-color-yellow;}
                    &.blue{background-color:$swipe-button-color-blue;}
                    &.red{background-color:$swipe-button-color-red;}
                }
            }
        }
    }
</style>

<template>
    <div class="ui-cell-swipe">
        <div class="ui-content" ref="cellBox"
             @click="getSwipeMove"
             @touchstart="startDrag"
             @touchmove="moveDrag"
             @touchend="endDrag">
            <slot name="content"></slot>
            <slot><div class="cell-text" flex="cross:center">{{title}}</div></slot>
        </div>
        <div class="ui-buttons-group" ref="buttonsGroup">
            <ul>
                <li flex="cross:center" v-for="item in buttons"
                    :class="item.class" :style="item.style"
                    @click.stop="item.handler && item.handler(), swipeMove()">{{item.text}}</li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     * v-cell-swipe
     * @module components/cell-swipe
     * @desc 列表滑块
     * @param {title} [String] - 纯文本显示---【''】，如果是嵌套子组件则不需要，只需指定<slot name="content">嵌入的组件</slot>
     * @param {buttons} [Array] - 数组对象---【{
     *      title: String --
     *      class: String 【gray, yellow, bule, red, 或自定义class，对应的class的样式需要写在父级中】
     *      style: String 【跟普通写样式一样】
     *      handler(event) => 【按钮触发事件方法】
     * }】
     *
     *
     * @example
     * <v-cell-swipe>
     * </v-cell-swipe>
     */
    import {once, addClass, removeClass} from '../config/uitls'
    
    export default {
        name: 'cell-swipe',
        
        props: {
            toLink: String,
            title: String,
            buttons: Array
        },
        
        data() {
            return {
                isSports: false,
                isSwiping: false,
                isOpened: false,
                offsetLeft: 0,
                start: {x: 0, y: 0},
                childInfo: null
            }
        },
        
        mounted() {
            let self = this;
            self.cellBox = self.$refs.cellBox;
            self.buttonsGroup = self.$refs.buttonsGroup;
            
            // 判断是否有按钮
            self.buttonsGroup.childNodes[0].children.length && (self.isSports = true);
            // 按钮组的总长度
            self.defaultWidth = this.buttonsGroup.getBoundingClientRect().width;
        },
        
        methods: {
            /**
             * 状态重置
             */
            resetStatus() {
                this.isSwiping = false;   // 是否在运动
                this.isOpened = false;     // 是否打开着
                this.offsetLeft = 0;    // 当前的偏移量
            },
            
            getSwipeMove() {
                let self = this;
                
                if (!self.isOpened && !!self.toLink) {
                    self.$router.push({path: '/'+self.toLink});
                    return;
                }
                self.swipeMove(0);
            },
            /**
             * 开始拖拽
             * @param event
             */
            startDrag(event) {
                let self = this;
                if (!self.isSports) return;
                event = event.changedTouches ? event.changedTouches[0] : event;
                self.dragging = true;
                self.start.x = event.pageX;
                self.start.y = event.pageY;
    
                let cellSwipe = document.querySelectorAll('.ui-cell-swipe .ui-content');
                for (let i=0;i<cellSwipe.length;i++){
                    cellSwipe[i].style.webkitTransform = self.__translate3d(0);
                }
            },
            /**
             * 拖拽
             * @param event
             */
            moveDrag(event) {
                let self = this;
                if (!self.dragging) return;
                let isSwiping;
                let e = event.changedTouches ? event.changedTouches[0] : event;
                let offsetTop = e.pageY - self.start.y;
                let offsetLeft = self.offsetLeft = e.pageX - self.start.x;
                
                // 禁止向右滑动
                if (offsetLeft > 0) return;
                
                if (offsetLeft < -self.defaultWidth) {
                    offsetLeft = -self.defaultWidth;
                }
                
                let y = Math.abs(offsetTop);
                let x = Math.abs(offsetLeft);
                
                isSwiping = !(x < -2);
              
                if (!isSwiping) return;
                event.preventDefault();
                self.swipeMove(offsetLeft);
            },
            /**
             * 结束拖拽
             */
            endDrag() {
                let self = this;
                self.__swipeOverAnimation(self.offsetLeft > 0 ? -1 : 1);
            },
            /**
             * 设置cellBoxX轴的位移
             * @param offset
             */
            swipeMove(offset = 0) {
                let self = this;
                // self.cellBox.style.webkitTransition="-webkit-transform .2s ease-out";
                self.cellBox.style.webkitTransform = self.__translate3d(offset);
                offset && (self.isSwiping = true);
                
                // 绑定动画效果结束之后，重置样式跟isSwiping状态
                once(self.cellBox, 'webkitTransitionEnd', _ => {
                    self.isSwiping = false;
                    if (offset === 0) {
                        self.cellBox.style.webkitTransform = '';
                        self.resetStatus();
                    } else if (Math.abs(offset) == self.defaultWidth){
                        this.isOpened = true;
                    }
                });
            },
            /**
             * X轴的位移
             * @param offset
             * @returns {string}
             */
            __translate3d(offset) {
                let value = Math.floor(offset);
                return `translate3d(${value}px, 0, 0)`;
            },
            /**
             * 结束拖拽后的动画
             * @param direction
             */
            __swipeOverAnimation(direction) {
                let self = this;
                
                setTimeout(() => {
                    // 向左边移动的偏移量 > 按钮的总长度的40%,则填充到按钮的总长度
                    if (direction > 0 && -self.offsetLeft > self.defaultWidth * 0.4) {
                        self.swipeMove(-self.defaultWidth);
                        self.resetStatus();
                        return;
                    }
    
                    // 否则偏移量等于0
                    self.swipeMove(0);
                }, 0);
            }
        }
    }
</script>
