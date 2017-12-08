<style lang="scss">
    @import '../assets/styles/scss/function.scss';
    
    .module-infinite-scroll {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .scroll-container {
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
         :style="{ height: wrapperHeight, transform: `translate3d(0, ${diff}px, 0)` }">
        
        <div v-if="pullDownMethod" ref="pullDown"
             :style="{ height: `${pullDownTextHeight}px`, marginTop: `${-pullDownTextHeight}px` }"
             class="action-block">
            <slot name="pull-down"
                  :state="state"
                  :state-text="topText">
                <p class="default-text">{{ topText }}</p>
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
                  :state-text="bottomText">
                <p class="default-text">{{ bottomText }}</p>
            </slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
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
                default: 50
            },
            wrapperHeight: {
                type: String,
                default: '100%'
            },
            pullDownMethod: {
                type: Function
            },
            pullUpMethod: {
                type: Function
            },
            isThrottleTopPull: {
                type: Boolean,
                default: true
            },
            isThrottleBottomPull: {
                type: Boolean,
                default: true
            },
            isThrottleScroll: {
                type: Boolean,
                default: true
            },
            isTopBounce: {
                type: Boolean,
                default: true
            },
            isBottomBounce: {
                type: Boolean,
                default: true
            },
            topConfig: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            bottomConfig: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            return {
                scrollEl: null,
                pullDownTextHeight: null,
                pullUpTextHeight: null,
                startScrollTop: 0,
                startY: 0,
                currentY: 0,
                distance: 0,
                direction: 0,
                diff: 0,
                beforeDiff: 0,
                topText: '',
                bottomText: '',
                state: '',
                bottomReached: false,
                throttleEmitTopPull: null,
                throttleEmitBottomPull: null,
                throttleEmitScroll: null,
                throttleOnInfiniteScroll: null
            };
        },
        computed: {
            _topConfig: function () {
                return Object.assign({}, TOP_DEFAULT_CONFIG, this.topConfig);
            },
            _bottomConfig: function () {
                return Object.assign({}, BOTTOM_DEFAULT_CONFIG, this.bottomConfig);
            }
        },
        watch: {
            state(val) {
                let self = this;
                if (self.direction === 'down') {
                    self.$emit('top-state-change', val);
                } else {
                    self.$emit('bottom-state-change', val);
                }
            }
        },
        methods: {
            actionPull() {
                let self = this;
                self.state = 'pull';
                self.direction === 'down'
                    ? self.topText = self._topConfig.pullText
                    : self.bottomText = self._bottomConfig.pullText;
            },
            actionTrigger() {
                let self = this;
                self.state = 'trigger';
                self.direction === 'down'
                    ? self.topText = self._topConfig.triggerText
                    : self.bottomText = self._bottomConfig.triggerText;
            },
            /**
             * 加载中停留的文本
             */
            actionLoading() {
                let self = this;
                self.state = 'loading';
                if (self.direction === 'down') {
                    self.topText = self._topConfig.loadingText;
                    /* eslint-disable no-useless-call */
                    self.pullDownMethod.call(self, self.actionLoaded);
                    self.scrollTo(self.pullDownTextHeight);
                } else {
                    self.bottomText = self._bottomConfig.loadingText;
                    self.pullUpMethod.call(self, self.actionLoaded);
                    self.scrollTo(-self.pullUpTextHeight);
                }
            },
            actionLoaded(loadState = 'done') {
                let self = this;
                self.state = `loaded-${loadState}`;
                let loadedStayTime;
                if (self.direction === 'down') {
                    self.topText = loadState === 'done'
                        ? self._topConfig.doneText
                        : self._topConfig.failText;
                    loadedStayTime = self._topConfig.loadedStayTime;
                } else {
                    self.bottomText = loadState === 'done'
                        ? self._bottomConfig.doneText
                        : self._bottomConfig.failText;
                    loadedStayTime = self._bottomConfig.loadedStayTime;
                }
                setTimeout(() => {
                    self.scrollTo(0);
                
                    // 重置状态
                    setTimeout(() => {
                        self.state = '';
                    }, 200);
                }, loadedStayTime);
            },
            scrollTo(y, duration = 200) {
                let self = this;
                self.$el.style.transition = `${duration}ms`;
                self.diff = y;
                setTimeout(() => {
                    self.$el.style.transition = '';
                }, duration);
            },
        
            checkBottomReached() {
                let elem = this.scrollEl
                let flag = elem.scrollTop + elem.offsetHeight + 1 >= elem.scrollHeight
                return flag;
            },
        
            handleTouchStart(event) {
                let self = this;
                self.startY = event.touches[0].clientY;
                self.beforeDiff = self.diff;
                self.startScrollTop = self.scrollEl.scrollTop;
                self.bottomReached = self.checkBottomReached();
            },
        
            handleTouchMove(event) {
                let self = this;
                self.currentY = event.touches[0].clientY;
                self.distance = (self.currentY - self.startY) / self.distanceIndex + self.beforeDiff;
                self.direction = self.distance > 0 ? 'down' : 'up';
            
                if (self.startScrollTop === 0 && self.direction === 'down' && self.isTopBounce) {
                    event.preventDefault();
                    event.stopPropagation();
                    self.diff = self.distance;
                    self.isThrottleTopPull ? self.throttleEmitTopPull(self.diff) : self.$emit('top-pull', self.diff);
                
                    if (typeof self.pullDownMethod !== 'function') return;
                
                    if (self.distance < self._topConfig.triggerDistance &&
                        self.state !== 'pull' && self.state !== 'loading') {
                        self.actionPull();
                    } else if (self.distance >= self._topConfig.triggerDistance &&
                        self.state !== 'trigger' && self.state !== 'loading') {
                        self.actionTrigger();
                    }
                } else if (self.bottomReached && self.direction === 'up' && self.isBottomBounce) {
                    event.preventDefault();
                    event.stopPropagation();
                    self.diff = self.distance;
                    self.isThrottleBottomPull ? self.throttleEmitBottomPull(self.diff) : self.$emit('bottom-pull', self.diff);
                
                    if (typeof self.pullUpMethod !== 'function') return;
                
                    if (Math.abs(self.distance) < self._bottomConfig.triggerDistance &&
                        self.state !== 'pull' && self.state !== 'loading') {
                        self.actionPull();
                    } else if (Math.abs(self.distance) >= self._bottomConfig.triggerDistance &&
                        self.state !== 'trigger' && self.state !== 'loading') {
                        self.actionTrigger();
                    }
                }
            },
        
            handleTouchEnd() {
                let self = this;
                console.log('结束', self.diff)
                if (self.diff !== 0) {
                    if (self.state === 'trigger') {
                        self.actionLoading();
                        return;
                    }
                
                    // pull cancel
                    self.scrollTo(0);
                }
            },
        
            handleScroll(event) {
                let self = this;
                self.isThrottleScroll ? self.throttleEmitScroll(event) : self.$emit('scroll', event);
                self.throttleOnInfiniteScroll();
            },
        
            onInfiniteScroll() {
                let self = this;
                if (self.checkBottomReached()) {
                    self.$emit('infinite-scroll');
                }
            },
        
            /**
             * 绑定触摸事件
             * */
            bindEvents() {
                let self = this;
                on(self.scrollEl, 'touchstart', self.handleTouchStart);
                on(self.scrollEl, 'touchmove', self.handleTouchMove);
                on(self.scrollEl, 'touchend', self.handleTouchEnd);
                on(self.scrollEl, 'scroll', self.handleScroll);
            },
            
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
            },
    
            createThrottleMethods() {
                let self = this;
                self.throttleEmitTopPull = self.throttleEmit(11200, 11300, 'top-pull');
                self.throttleEmitBottomPull = self.throttleEmit(11200, 11300, 'bottom-pull');
                self.throttleEmitScroll = self.throttleEmit(11100, 11150, 'scroll');
                self.throttleOnInfiniteScroll = throttle(self.onInfiniteScroll, 41100);
            },
    
            throttleEmit(delay, mustRunDelay = 0, eventName) {
                let self = this;
                const throttleMethod = function () {
                    const args = [...arguments];
                    args.unshift(eventName);
                    self.$emit.apply(self, args);
                };
        
                return throttle(throttleMethod, delay, mustRunDelay);
            },
        },
        mounted() {
            this.init();
        }
    };
</script>
