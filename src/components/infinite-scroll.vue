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
        -webkit-overflow-scrolling: touch;
    }
    
    .module-infinite-scroll .action-block {
        position: relative;
        width: 100%;
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
        
        <div class="scroll-container">
            <slot></slot>
        </div>
        
        <div v-if="pullUpMethod" ref="pullUp"
             :style="{ height: `${pullUpTextHeight}px`, marginBottom: `${-pullUpTextHeight}px` }"
             class="action-block">
            <slot name="bottom-block"
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
     * @param {topBlockHeight} [Number, String] - 下拉区域显示的内容---【'auto'】
     * @param {bottomBlockHeight} [Number, String] - 上拉区域显示的内容---【'auto'】
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
    import {on, throttle} from '../config/uitls'
    import { TOP_DEFAULT_CONFIG, BOTTOM_DEFAULT_CONFIG } from './language-ch';
    
    export default {
        name: 'v-infinite-scroll',
        
        props: {
            distanceIndex: {
                type: Number,
                default: 2
            },
            topBlockHeight: {
                type: [Number, String],
                default: 'auto'
            },
            bottomBlockHeight: {
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
                containerHeight: null, // 内容容器高度
                startScrollTop: 0, // 开始滚动的位置
                startY: 0, // 开始触摸的开始位置
                currentY: 0, // 当前触摸的位置
                distance: 0, // 滑动的距离
                direction: 0, // 滑动的方向
                diff: 0, // 滑动上拉下拉的偏移量
                beforeDiff: 0, // 开始触摸上拉下拉的偏移量
                pullDownText: '', // 上拉当前的文本内容
                pullUpText: '', // 下拉当前的文本内容
                state: '',  // 当前状态
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
                    self.$emit('top-state-change', val);
                } else {
                    self.$emit('bottom-state-change', val);
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
                if (self.topBlockHeight === 'auto') {
                    self.pullDownTextHeight = self.$refs.pullDown.offsetHeight;
                } else {
                    self.pullDownTextHeight = self.topBlockHeight;
                }
                // 上拉的文本高度
                if (self.bottomBlockHeight === 'auto') {
                    self.pullUpTextHeight = self.$refs.pullDown.offsetHeight;
                } else {
                    self.pullUpTextHeight = self.bottomBlockHeight;
                }
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
                    /* eslint-disable no-useless-call */
                    self.pullDownMethod.call(self, self.actionLoaded);
                    self.scrollTo(self.pullDownTextHeight);
                } else {
                    self.pullUpText = self._pullUpConfig.loadingText;
                    self.pullUpMethod.call(self, self.actionLoaded);
                    self.scrollTo(-self.pullUpTextHeight);
                }
            },
    
            /**
             * 加载完成之后的文本状态
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
                    self.pullUpText = loadState === 'done'
                        ? self._pullUpConfig.doneText
                        : self._pullUpConfig.failText;
                    loadedStayTime = self._pullUpConfig.loadedStayTime;
                }
                setTimeout(() => {
                    self.scrollTo(0);
            
                    // 重置状态
                    setTimeout(() => {
                        self.state = '';
                    }, 200);
                }, loadedStayTime);
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
                // 当前触摸的位置
                self.currentY = event.touches[0].clientY;
                self.distance = (self.currentY - self.startY) / self.distanceIndex + self.beforeDiff;
                self.direction = self.distance > 0 ? 'down' : 'up';
        
                // 下拉更新
                if (self.startScrollTop === 0 && self.direction === 'down' && self.isPullDownBounce) {
                    event.preventDefault();
                    event.stopPropagation();
            
                    self.diff = self.distance;
                    self.isThrottlePullDown ? self.throttleEmitPullDown(self.diff) : self.$emit('pull-down', self.diff);
            
                    if (typeof self.pullDownMethod !== 'function') return;
            
                    if (self.distance < self._pullDownConfig.triggerDistance
                        && self.state !== 'pull'
                        && self.state !== 'loading') {
                        self.actionPull();
                    } else if (self.distance >= self._pullDownConfig.triggerDistance
                        && self.state !== 'trigger'
                        && self.state !== 'loading') {
                        self.actionTrigger();
                    }
                }
                // 上拉加载
                else if (self.isReachedBottom && self.direction === 'up' && self.isPullUpBounce) {
                    event.preventDefault();
                    event.stopPropagation();
                    // console.log('up', self.throttleEmitPullUp)
                    self.diff = self.distance;
                    self.isThrottlePullUp ? self.throttleEmitPullUp(self.diff) : self.$emit('pull-up', self.diff);
            
                    if (typeof self.pullUpMethod !== 'function') return;
            
                    if (Math.abs(self.distance) < self._pullUpConfig.triggerDistance
                        && self.state !== 'pull'
                        && self.state !== 'loading') {
                        self.actionPull();
                    } else if (Math.abs(self.distance) >= self._pullUpConfig.triggerDistance
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
                if (self.diff !== 0) {
                    if (self.state === 'trigger') {
                        self.actionLoading();
                        return;
                    }
                    self.scrollTo(0);
                }
            },
    
            /**
             * 滚动事件
             */
            scrollDrag(event) {
                let self = this;
                self.isThrottleScroll ? self.throttleEmitScroll(event) : self.$emit('scroll', event);
                self.throttleOnInfiniteScroll();
            },
        }
    };
</script>
