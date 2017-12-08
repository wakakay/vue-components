<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';

    .module-slide{
        height:100%;background:rgba(0,0,0,.8);position:relative;overflow:hidden;
        .module-slide-items-wrap {
            height:100%;position:relative;overflow:hidden;
        }
        .module-slide-pagination{
            width:100%;padding:0 px(20);background:rgba(0,0,0,.7);position:absolute;left:0;bottom:0;z-index:$z-index-normal;
            .ui-slide-title{
                color:#fff;
                p{height:px(50);}
            }
            .ui-slide-pagination{
                height:px(50);
                span{
                    display:inline-block;margin:0 px(4);width:px(8);height:px(8);background:rgb(147,147,147);border-radius:100%;
                    &.active{
                        width:px(12);height:px(12);background:rgb(255,255,255);
                    }
                }
            }
            .ui-slide-pagination-border{
                width:100%;background:rgba(0,0,0,.7);position:absolute;left:0;bottom:0;z-index:$z-index-normal;
                span{
                    display:block;height:px(4);
                    &.active{background:#26a2ff; }
                }
            }
        }
    }
</style>

<template>
    <div class="module-slide">
        <div class="module-slide-items-wrap" ref="wrap">
            <slot></slot>
        </div>
        
        <div class="module-slide-pagination"
             flex="px==1 ? main:justify : ''">
            <div class="ui-slide-title">
                <p v-show="showTitle" flex="cross:center">{{currentTitle}}</p>
            </div>
            <div class="ui-slide-pagination" flex="cross:center" v-if="px==1">
        <span v-for="(page, $index) in pages"
              :class="{ 'active': $index === index }"></span>
            </div>
            <div class="ui-slide-pagination-border" flex="dir:left box:mean" v-if="px==2">
        <span v-for="(page, $index) in pages"
              :class="{ 'active': $index === index }"></span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {once, addClass, removeClass} from '../config/uitls'
    
    /**
     * v-slide
     * @module components/slide
     * @desc 幻灯片
     * @param {speed} [Number] - 切换运动的事件（毫秒数），默认300
     * @param {defaultIndex} [Number] - 默认从第几张开始，默认0
     * @param {auto} [Number] - 大于0则自动播放，且没间隔这个Number为时间（毫秒数），小于等于0不自动，默认自动3s
     * @param {continuous} [Boolean] - 是否连贯，默认true
     * @param {px} [Number] - 展示页面当前显示第N张图的风格，{1: 点, 2: 横条, 其他: 不现实}
     * @param {showTitle} [Boolean] - 是否对应的标题，默认true
     * @param {noDragWhenSingle} [Boolean] - 当只有一张的时候不给拖拽效果，默认true
     * @param {prevent} [Boolean] - 是否防止冒泡事件，用于叠加在slide上面的其他元素的冒泡事件，默认false
     * @param {stopPropagation} [Boolean] - 是否防止冒泡事件，用于叠加在slide上面的其他元素的冒泡事件，默认false
     *
     * @example
     * <v-slide>
     *   <v-slide-item title="标题">图片或文本内容</v-slide-item>
     *   <v-slide-item title="标题">图片或文本内容</v-slide-item>
     * </v-slide>
     */
    export default {
        name: 'slide',
        
        created() {
            this.dragState = {}
        },
        
        data() {
            return {
                ready: false,
                dragging: false,
                userScrolling: false,
                animating: false,
                titles: [], // 对应每张图片的title
                currentTitle: null, // 当前将要显示的title
                index: 0, // 当前将要显示的slide
                pages: [],  // 共有第三张slide
                timer: null,  // 定时器
                reInitTimer: null,
                noDrag: false,
                isDone: false
            }
        },
        
        props: {
            speed: {
                type: Number,
                default: 300
            },
            
            defaultIndex: {
                type: Number,
                default: 0
            },
            auto: {
                type: Number,
                default: 3000
            },
            
            continuous: {
                type: Boolean,
                default: true
            },
            
            showTitle: {
                type: Boolean,
                default: true
            },
            
            px: {
                type: Number,
                default: 1
            },
            
            noDragWhenSingle: {
                type: Boolean,
                default: false
            },
            
            prevent: {
                type: Boolean,
                default: false
            },
            
            stopPropagation: {
                type: Boolean,
                default: false
            }
        },
        
        watch: {
            index(newIndex) {
                this.$emit('change', newIndex)
            }
        },
        
        methods: {
            slideItemCreated(info) {
                // 接受slide-item中传递的标题
                let slideTile = info.title
                if (slideTile.length > 20) {
                    slideTile = slideTile.substr(0, 20) + '...'
                }
                this.titles.push(slideTile)
                // 是否准备就绪
                if (!this.ready) return
                
                clearTimeout(this.reInitTimer)
                this.reInitTimer = setTimeout(() => {
                    this.reInitPages()
                }, 100)
            },
            
            slideItemDestroyed() {
                // 是否准备就绪
                if (!this.ready) return
                
                clearTimeout(this.reInitTimer)
                this.reInitTimer = setTimeout(() => {
                    this.reInitPages()
                }, 100)
            },
            
            translate(element, offset, speed, callback) {
                if (speed) {
                    this.animating = true
                    element.style.webkitTransition = '-webkit-transform ' + speed + 'ms ease-in-out'
                    setTimeout(() => {
                        element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
                    }, 50)
                    
                    let called = false
                    
                    let transitionEndCallback = () => {
                        if (called) return
                        called = true
                        this.animating = false
                        element.style.webkitTransition = ''
                        element.style.webkitTransform = ''
                        if (callback) {
                            callback.apply(this, arguments)
                        }
                    }
                    // 事件绑定
                    once(element, 'webkitTransitionEnd', transitionEndCallback)
                    setTimeout(transitionEndCallback, speed + 100) // webkitTransitionEnd maybe not fire on lower version android.
                } else {
                    element.style.webkitTransition = ''
                    element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
                }
            },
            
            reInitPages() {
                let children = this.$children
                this.noDrag = children.length === 1 && this.noDragWhenSingle
                
                let pages = []
                let intDefaultIndex = Math.floor(this.defaultIndex)
                let defaultIndex = (intDefaultIndex >= 0 && intDefaultIndex < children.length) ? intDefaultIndex : 0
                this.index = defaultIndex
                this.currentTitle = this.titles[defaultIndex]
                
                children.forEach(function (child, index) {
                    pages.push(child.$el)
                    
                    removeClass(child.$el, 'active')
                    
                    if (index === defaultIndex) {
                        addClass(child.$el, 'active')
                    }
                })
                
                this.pages = pages
            },
            
            doAnimate(towards, options) {
                if (this.$children.length === 0) return
                if (!options && this.$children.length < 2) return
                
                let prevPage, nextPage, currentPage, pageWidth, offsetLeft
                let speed = this.speed || 300
                let index = this.index
                let pages = this.pages
                let pageCount = pages.length
                
                if (!options) {
                    pageWidth = this.$el.clientWidth
                    currentPage = pages[index]
                    prevPage = pages[index - 1]
                    nextPage = pages[index + 1]
                    if (this.continuous && pages.length > 1) {
                        if (!prevPage) {
                            prevPage = pages[pages.length - 1]
                        }
                        if (!nextPage) {
                            nextPage = pages[0]
                        }
                    }
                    if (prevPage) {
                        prevPage.style.display = 'block'
                        this.translate(prevPage, -pageWidth)
                    }
                    if (nextPage) {
                        nextPage.style.display = 'block'
                        this.translate(nextPage, pageWidth)
                    }
                } else {
                    prevPage = options.prevPage
                    currentPage = options.currentPage
                    nextPage = options.nextPage
                    pageWidth = options.pageWidth
                    offsetLeft = options.offsetLeft
                }
                
                let newIndex
                
                let oldPage = this.$children[index].$el
                
                if (towards === 'prev') {
                    if (index > 0) {
                        newIndex = index - 1
                    }
                    if (this.continuous && index === 0) {
                        newIndex = pageCount - 1
                    }
                } else if (towards === 'next') {
                    if (index < pageCount - 1) {
                        newIndex = index + 1
                    }
                    if (this.continuous && index === pageCount - 1) {
                        newIndex = 0
                    }
                }
                
                let callback = () => {
                    if (newIndex !== undefined) {
                        let newPage = this.$children[newIndex].$el
                        removeClass(oldPage, 'active')
                        addClass(newPage, 'active')
                        
                        this.currentTitle = this.titles[newIndex]
                        this.index = newIndex
                    }
                    if (this.isDone) {
                        this.end()
                    }
                    
                    if (prevPage) {
                        prevPage.style.display = ''
                    }
                    
                    if (nextPage) {
                        nextPage.style.display = ''
                    }
                }
                
                setTimeout(() => {
                    if (towards === 'next') {
                        this.isDone = true
                        this.before(currentPage)
                        this.translate(currentPage, -pageWidth, speed, callback)
                        if (nextPage) {
                            this.translate(nextPage, 0, speed)
                        }
                    } else if (towards === 'prev') {
                        this.isDone = true
                        this.before(currentPage)
                        this.translate(currentPage, pageWidth, speed, callback)
                        if (prevPage) {
                            this.translate(prevPage, 0, speed)
                        }
                    } else {
                        this.isDone = false
                        this.translate(currentPage, 0, speed, callback)
                        if (typeof offsetLeft !== 'undefined') {
                            if (prevPage && offsetLeft > 0) {
                                this.translate(prevPage, pageWidth * -1, speed)
                            }
                            if (nextPage && offsetLeft < 0) {
                                this.translate(nextPage, pageWidth, speed)
                            }
                        } else {
                            if (prevPage) {
                                this.translate(prevPage, pageWidth * -1, speed)
                            }
                            if (nextPage) {
                                this.translate(nextPage, pageWidth, speed)
                            }
                        }
                    }
                }, 10)
            },
            
            next() {
                this.doAnimate('next')
            },
            
            prev() {
                this.doAnimate('prev')
            },
            
            before() {
                this.$emit('before', this.index)
            },
            
            end() {
                this.$emit('end', this.index)
            },
            
            doOnTouchStart(event) {
                if (this.noDrag) return
                
                let element = this.$el
                let dragState = this.dragState
                let touch = event.touches[0]
                
                dragState.startTime = new Date()
                dragState.startLeft = touch.pageX
                dragState.startTop = touch.pageY
                dragState.startTopAbsolute = touch.clientY
                
                dragState.pageWidth = element.offsetWidth
                dragState.pageHeight = element.offsetHeight
                
                let prevPage = this.$children[this.index - 1]
                let dragPage = this.$children[this.index]
                let nextPage = this.$children[this.index + 1]
                
                if (this.continuous && this.pages.length > 1) {
                    if (!prevPage) {
                        prevPage = this.$children[this.$children.length - 1]
                    }
                    if (!nextPage) {
                        nextPage = this.$children[0]
                    }
                }
                
                dragState.prevPage = prevPage ? prevPage.$el : null
                dragState.dragPage = dragPage ? dragPage.$el : null
                dragState.nextPage = nextPage ? nextPage.$el : null
                
                if (dragState.prevPage) {
                    dragState.prevPage.style.display = 'block'
                }
                
                if (dragState.nextPage) {
                    dragState.nextPage.style.display = 'block'
                }
            },
            
            doOnTouchMove(event) {
                if (this.noDrag) return
                
                let dragState = this.dragState
                let touch = event.touches[0]
                
                dragState.currentLeft = touch.pageX
                dragState.currentTop = touch.pageY
                dragState.currentTopAbsolute = touch.clientY
                
                let offsetLeft = dragState.currentLeft - dragState.startLeft
                let offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute
                
                let distanceX = Math.abs(offsetLeft)
                let distanceY = Math.abs(offsetTop)
                if (distanceX < 5 || (distanceX >= 5 && distanceY >= 1.73 * distanceX)) {
                    this.userScrolling = true
                    return
                } else {
                    this.userScrolling = false
                    event.preventDefault()
                }
                offsetLeft = Math.min(Math.max(-dragState.pageWidth + 1, offsetLeft), dragState.pageWidth - 1)
                
                let towards = offsetLeft < 0 ? 'next' : 'prev'
                
                if (dragState.prevPage && towards === 'prev') {
                    this.translate(dragState.prevPage, offsetLeft - dragState.pageWidth)
                }
                this.translate(dragState.dragPage, offsetLeft)
                if (dragState.nextPage && towards === 'next') {
                    this.translate(dragState.nextPage, offsetLeft + dragState.pageWidth)
                }
            },
            
            doOnTouchEnd() {
                if (this.noDrag) return
                
                let dragState = this.dragState
                
                let dragDuration = new Date() - dragState.startTime
                let towards = null
                
                let offsetLeft = dragState.currentLeft - dragState.startLeft
                let offsetTop = dragState.currentTop - dragState.startTop
                let pageWidth = dragState.pageWidth
                let index = this.index
                let pageCount = this.pages.length
                
                if (dragDuration < 300) {
                    let fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop) < 5
                    if (isNaN(offsetLeft) || isNaN(offsetTop)) {
                        fireTap = true
                    }
                    if (fireTap) {
                        this.$children[this.index].$emit('tap')
                    }
                }
                
                if (dragDuration < 300 && dragState.currentLeft === undefined) return
                
                if (dragDuration < 300 || Math.abs(offsetLeft) > pageWidth / 2) {
                    towards = offsetLeft < 0 ? 'next' : 'prev'
                }
                
                if (!this.continuous) {
                    if ((index === 0 && towards === 'prev') || (index === pageCount - 1 && towards === 'next')) {
                        towards = null
                    }
                }
                
                if (this.$children.length < 2) {
                    towards = null
                }
                
                this.doAnimate(towards, {
                    offsetLeft: offsetLeft,
                    pageWidth: dragState.pageWidth,
                    prevPage: dragState.prevPage,
                    currentPage: dragState.dragPage,
                    nextPage: dragState.nextPage
                })
                
                this.dragState = {}
            },
            
            initTimer() {
                if (this.auto > 0 && !this.timer) {
                    this.timer = setInterval(() => {
                        if (!this.continuous && (this.index >= this.pages.length - 1)) {
                            return this.clearTimer()
                        }
                        if (!this.dragging && !this.animating) {
                            this.next()
                        }
                    }, this.auto)
                }
            },
            
            clearTimer() {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        
        destroyed() {
            if (this.timer) {
                this.clearTimer()
            }
            if (this.reInitTimer) {
                clearTimeout(this.reInitTimer)
                this.reInitTimer = null
            }
        },
        
        mounted() {
            this.ready = true
            
            this.initTimer()
            
            this.reInitPages()
            
            let element = this.$el
            
            element.addEventListener('touchstart', (event) => {
                if (this.prevent) event.preventDefault()
                if (this.stopPropagation) event.stopPropagation()
                if (this.animating) return
                this.dragging = true
                this.userScrolling = false
                this.doOnTouchStart(event)
            })
            
            element.addEventListener('touchmove', (event) => {
                if (!this.dragging) return
                if (this.timer) this.clearTimer()
                this.doOnTouchMove(event)
            })
            
            element.addEventListener('touchend', (event) => {
                if (this.userScrolling) {
                    this.dragging = false
                    this.dragState = {}
                    return
                }
                if (!this.dragging) return
                this.initTimer()
                this.doOnTouchEnd(event)
                this.dragging = false
            })
        }
    }
</script>
