<style lang="scss">
    @import '../assets/styles/scss/function.scss';
    
    .module-infinite-scroll {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .scroll-container {
        height: 100%;
        flex: 1;
        overflow-y: auto;
    }
    .overflow-scrolling{
        -webkit-overflow-scrolling: touch;
    }
    .module-infinite-scroll .action-block {
        position: relative;
        width: 100%;
        background: #e4e4e4;
    }
    
    .default-text {
        height: 100%;
        line-height: 50px;
        text-align: center;
    }
</style>

<template>
    <div class="module-infinite-scroll"
         :style="{ height: containerHeight, transform: `translate3d(0, ${diff}px, 0)` }">
        
        <div v-if="pullDownMethod" ref="pullDown"
             :style="{ height: `${pullDownTextHeight}px`, marginTop: `${-pullDownTextHeight}px` }"
             class="action-block">
            <slot name="pull-down"
                  :state="state"
                  :state-text="pullDownText">
                <p class="default-text">{{ pullDownText }}</p>
            </slot>
        </div>
        
        <div class="scroll-container overflow-scrolling" ref="scrollContainer">
            <slot></slot>
        </div>
        
        <div v-if="pullUpMethod" ref="pullUp" @click="getAgainLoading"
             :style="{ height: `${pullUpTextHeight}px`, marginBottom: `${-pullUpTextHeight}px` }"
             class="action-block">
            <slot name="pull-up"
                  :state="state"
                  :state-text="pullUpText">
                <p class="default-text">{{ pullUpText }}</p>
            </slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     * v-infinite-scroll
     * @module components/infinite-scroll
     * @desc 列表上拉更新下拉加载
     * @param {distanceIndex} [Number] - 上拉下拉的滚动阀值---【2】
     * @param {pullDownBlockHeight} [Number, String] - 下拉区域显示的内容---【'auto'】
     * @param {pullUpBlockHeight} [Number, String] - 上拉区域显示的内容---【'auto'】
     * @param {wrapperHeight} [Number, String] - 滚动容器高度---【'100%'】，默认值body的可视高度-header组件的高度，其他情况需要动态传入Number的值
     * @param {pullDownMethod} [Function] - 上拉更新之后的回调函数
     * @param {pullUpMethod} [Function] - 下拉加载更多之后的回调函数
     * @param {isThrottlePullDown} [Boolean] - 是否开启上拉更新节流---【true】
     * @param {isThrottlePullUp} [Boolean] - 是否开启下拉加载节流---【true】
     * @param {isThrottleScroll} [Boolean] - 是否开启滚动节流---【true】
     * @param {isPullDownBounce} [Boolean] - 是否允许下拉更新---【true】
     * @param {isPullUpBounce} [Boolean] - 是否允许上拉加载---【true】
     * @param {pullDownConfig} [Object] - 是否允许上拉加载
     * @param {pullUpConfig} [Object] - 是否允许上拉加载
     *
     * @example
     * <v-infinite-scroll>
     * </v-infinite-scroll>
     */
    import {on, addClass, removeClass, throttle} from '../config/uitls'
    import { TOP_DEFAULT_CONFIG, BOTTOM_DEFAULT_CONFIG } from './language-ch';
    
    export default {
        name: 'v-infinite-scroll',
        
        props: {
            distanceIndex: {
                type: Number,
                default: 2
            },
            pullDownBlockHeight: {
                type: [Number, String],
                default: 'auto'
            },
            pullUpBlockHeight: {
                type: [Number, String],
                default: 'auto'
            },
            wrapperHeight: {
                type: [Number, String],
                default: '100%'
            },
            pullDownMethod: {
                type: Function
            },
            pullUpMethod: {
                type: Function
            },
            pullUpFail: {
                type: Function
            },
            isThrottlePullDown: {
                type: Boolean,
                default: true
            },
            isThrottlePullUp: {
                type: Boolean,
                default: true
            },
            isThrottleScroll: {
                type: Boolean,
                default: true
            },
            isPullDownBounce: {
                type: Boolean,
                default: true
            },
            isPullUpBounce: {
                type: Boolean,
                default: true
            },
            pullDownConfig: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            pullUpConfig: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        
        data() {
            return {
                scrollEl: null, // 滚动容器
                pullDownTextHeight: null, // 下拉内容高度
                pullUpTextHeight: null, // 上拉内容高度
                pullDowntriggerDistance: null, // 下拉触发距离
                pullUptriggerDistance: null, // 上拉触发距离
                containerHeight: null, // 内容容器高度
                startScrollTop: 0, // 开始滚动的位置
                startY: 0, // 开始触摸的开始位置
                currentY: 0, // 当前触摸的位置
                isReached: false, // 在滑动的时候是否到达顶部或底部
                distance: 0, // 滑动的距离
                direction: 0, // 滑动的方向
                diff: 0, // 滑动上拉下拉的偏移量
                beforeDiff: 0, // 开始触摸上拉下拉的偏移量
                reachedTopDistance: 0,
                pullDownText: '', // 上拉当前的文本内容
                pullUpText: '', // 下拉当前的文本内容
                state: '',  // 当前状态
                isFail: false, // 是否加载数据出错
                isReachedBottom: false, // 是否滚动到底部
                throttleEmitPullDown: null, // 下拉更新节流
                throttleEmitPullUp: null, // 上拉加载节流
                throttleEmitScroll: null, // 滚动节流
                throttleOnInfiniteScroll: null // 无限滚动节流
            };
        },
        
        computed: {
            // 引入下拉更新的对应文案
            _pullDownConfig: function () {
                return Object.assign({}, TOP_DEFAULT_CONFIG, this.pullDownConfig);
            },
            // 引入上拉加载的对应文案
            _pullUpConfig: function () {
                return Object.assign({}, BOTTOM_DEFAULT_CONFIG, this.pullUpConfig);
            }
        },
        
        watch: {
            // 监听当前状态并发布通知
            state(val) {
                let self = this;
                if (self.direction === 'down') {
                    self.$emit('pull-down-state-change', val);
                } else {
                    self.$emit('pull-up-state-change', val);
                }
            }
        },
        
        mounted() {
            this.init();
        },
        
        methods: {
            /**
             * 初始化
             */
            init() {
                let self = this;
                self.propsInit();
                self.createThrottleMethods();
                self.scrollEl = self.$el.querySelector('.scroll-container');
                self.bindEvents();
            },
            
            /**
             * 转化props参数下对应的值
             */
            propsInit() {
                let self = this;
                // 下拉的文本高度
                if (self.pullDownBlockHeight === 'auto') {
                    self.pullDownTextHeight = self.$refs.pullDown.offsetHeight;
                } else {
                    self.pullDownTextHeight = self.pullDownBlockHeight;
                }
                self.pullDowntriggerDistance = self.pullDownTextHeight + 10;
                // 上拉的文本高度
                if (self.pullUpBlockHeight === 'auto') {
                    self.pullUpTextHeight = self.$refs.pullDown.offsetHeight;
                } else {
                    self.pullUpTextHeight = self.pullUpBlockHeight;
                }
                self.pullUptriggerDistance = self.pullUpTextHeight + 10;
                // 设置滚动区域的高度
                if (self.wrapperHeight == '100%') {
                    let header = document.querySelector('.module-header');
                    let headerHeight = (header && header.offsetHeight) || 0;
                    self.containerHeight = document.body.clientHeight - headerHeight + 'px'
                } else {
                    self.containerHeight = self.wrapperHeight + 'px';
                }
            },
    
            /**
             * 绑定触摸事件
             * */
            bindEvents() {
                let self = this;
                on(self.scrollEl, 'touchstart', self.startDrag);
                on(self.scrollEl, 'touchmove', self.moveDrag);
                on(self.scrollEl, 'touchend', self.endDrag);
                on(self.scrollEl, 'scroll', self.scrollDrag);
            },
            
            /**
             * 创建节流处理
             */
            createThrottleMethods() {
                let self = this;
                self.throttleEmitPullDown = self.throttleEmit(200, 300, 'pull-down');
                self.throttleEmitPullUp = self.throttleEmit(200, 300, 'pull-up');
                self.throttleEmitScroll = self.throttleEmit(100, 150, 'scroll');
                self.throttleOnInfiniteScroll = throttle(self.onInfiniteScroll, 100);
            },
            
            /**
             * 通知节流方法
             * @param delay 延迟时间（ms）
             * @param mustRunDelay 间隔时间（ms）
             * @param eventName 延迟的时间名
             * @returns {*}
             */
            throttleEmit(delay, mustRunDelay = 0, eventName) {
                let self = this;
                const throttleMethod = function () {
                    const args = [...arguments];
                    args.unshift(eventName);
                    self.$emit.apply(self, args);
                };
                return throttle(throttleMethod, delay, mustRunDelay);
            },
    
            /**
             * 通知滚动
             */
            onInfiniteScroll() {
                let self = this;
                if (self.checkReachedBottom()) {
                    self.$emit('infinite-scroll');
                }
            },
    
            /**
             * 进入上拉下拉区域
             */
            actionPull() {
                let self = this;
                console.log('pull');
                self.state = 'pull';
                self.direction === 'down'
                    ? self.pullDownText = self._pullDownConfig.pullText
                    : self.pullUpText = self._pullUpConfig.pullText;
            },
    
            /**
             * 触发上拉下拉
             */
            actionTrigger() {
                let self = this;
                console.log('trigger');
                self.state = 'trigger';
                self.direction === 'down'
                    ? self.pullDownText = self._pullDownConfig.triggerText
                    : self.pullUpText = self._pullUpConfig.triggerText;
            },
    
            /**
             * 加载中停留的文本状态
             */
            actionLoading() {
                let self = this;
                self.state = 'loading';
                if (self.direction === 'down') {
                    self.pullDownText = self._pullDownConfig.loadingText;
                    self.pullDownMethod.call(self, self.actionLoaded);
                    self.scrollTo(self.pullDownTextHeight);
                } else {
                    self.pullUpText = self._pullUpConfig.loadingText;
                    self.pullUpMethod.call(self, self.actionLoaded);
                    self.scrollTo(-self.pullUpTextHeight);
                }
            },
    
            /**
             * 等待数据更新完毕后的处理结果
             */
            actionLoaded(loadState = 'done') {
                let self = this;
                self.state = `loaded-${loadState}`;
                let loadedStayTime;
                if (self.direction === 'down') {
                    self.pullDownText = loadState === 'done'
                        ? self._pullDownConfig.doneText
                        : self._pullDownConfig.failText;
                    loadedStayTime = self._pullDownConfig.loadedStayTime;
                } else {
                    if (loadState === 'done') {
                        self.pullUpText = self._pullUpConfig.doneText;
                        self.isFail = false;
                    } else {
                        self.pullUpText = self._pullUpConfig.failTipText;
                        self.isFail = true;
                    }
                    loadedStayTime = self._pullUpConfig.loadedStayTime;
                }
                setTimeout(() => {
                    !self.isFail && self.scrollTo(0);
                    // 重置状态
                    setTimeout(() => {
                        self.state = '';
                        self.addSpringback();
                    }, 200);
                }, loadedStayTime);
            },
    
            /**
             * 添加滚动的回弹效果
             */
            addSpringback() {
                let self = this;
                addClass(self.scrollEl, 'overflow-scrolling');
            },
            
            /**
             * 取消滚动的回弹效果
             */
            canleSpringback() {
                let self = this;
                removeClass(self.scrollEl, 'overflow-scrolling');
            },
            
            /**
             * 回滚回到某个位置
             */
            scrollTo(y, duration = 200) {
                let self = this;
                self.$el.style.transition = `${duration}ms`;
                self.diff = y;
                setTimeout(() => {
                    self.$el.style.transition = '';
                }, duration);
            },
    
            /**
             * 是否滚动到底部
             */
            checkReachedBottom() {
                let elem = this.scrollEl;
                let flag = elem.scrollTop + elem.offsetHeight + 1 >= elem.scrollHeight;
                return flag;
            },
    
            /**
             * 开始拖拽
             * @param event
             */
            startDrag(event) {
                let self = this;
                self.startY = event.touches[0].clientY;
                self.beforeDiff = self.diff;
                self.startScrollTop = self.scrollEl.scrollTop;
                self.isReachedBottom = self.checkReachedBottom();
            },
    
            /**
             * 拖拽
             * @param event
             */
            moveDrag(event) {
                let self = this;
                let scrollLoction = self.scrollEl.scrollTop;
                // 当前触摸的位置
                self.currentY = event.touches[0].clientY;
                // 当前滑动的距离
                self.distance = (self.currentY - self.startY) / self.distanceIndex + self.beforeDiff;
                // 滑动的方向
                self.direction = self.distance > 0 ? 'down' : 'up';
                
                if (!self.isReached && scrollLoction === 0) {
                    self.reachedTopDistance = self.distance;
                    self.isReached = true;
                }
             
                // 下拉更新
                if (scrollLoction <= 0 && self.direction === 'down' && self.isPullDownBounce) {
                    event.preventDefault();
                    event.stopPropagation();
    
                    self.canleSpringback();
                    self.diff = self.distance - self.reachedTopDistance;
                    self.isThrottlePullDown ? self.throttleEmitPullDown(self.diff) : self.$emit('pull-down', self.diff);
            
                    if (typeof self.pullDownMethod !== 'function') return;
            
                    if (self.distance < self.pullDowntriggerDistance
                        && self.state !== 'pull'
                        && self.state !== 'loading') {
                        self.actionPull();
                    } else if (self.distance >= self.pullDowntriggerDistance
                        && self.state !== 'trigger'
                        && self.state !== 'loading') {
                        self.actionTrigger();
                    }
                }
                // 上拉加载
                else if (self.isReachedBottom && self.direction === 'up' && self.isPullUpBounce) {
                    if (self.isFail) return;
                    event.preventDefault();
                    event.stopPropagation();
                    self.canleSpringback();
                    self.diff = self.distance;
                    self.isThrottlePullUp ? self.throttleEmitPullUp(self.diff) : self.$emit('pull-up', self.diff);
            
                    if (typeof self.pullUpMethod !== 'function') return;
            
                    if (Math.abs(self.distance) < self.pullUptriggerDistance
                        && self.state !== 'pull'
                        && self.state !== 'loading') {
                        self.actionPull();
                    } else if (Math.abs(self.distance) >= self.pullUptriggerDistance
                        &&self.state !== 'trigger'
                        && self.state !== 'loading') {
                        self.actionTrigger();
                    }
                }
            },
    
            /**
             * 结束拖拽
             */
            endDrag() {
                let self = this;
                self.addSpringback();
                if (self.diff !== 0) {
                    if (self.state === 'trigger') {
                        self.actionLoading();
                        return;
                    }
                    // 数据加载失败，保留提示框
                    !self.isFail && self.scrollTo(0);
                }
                
                self.isReached = false;
            },
    
            /**
             * 滚动事件
             */
            scrollDrag(event) {
                let self = this;
                self.isThrottleScroll ? self.throttleEmitScroll(event) : self.$emit('scroll', event);
                self.throttleOnInfiniteScroll();
            },
            
            /**
             * 重新加载数据
             * @param event
             */
            getAgainLoading() {
                let self = this;
                self.state = 'loading';
                if (self.direction === 'up') {
                    self.pullUpText = self._pullUpConfig.loadingText;
                    self.pullUpFail.call(self, self.actionLoaded);
                    self.scrollTo(-self.pullUpTextHeight);
                }
            }
        }
    };
</script>
