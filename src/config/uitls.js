/**
 * @file
 * @author: lzb
 * @params: 参数说明
 * @history:
 * Date      Version Remarks
 * ========= ======= ==================================
 * 2017/11/2       1.0     First version
 *
 */

/* 是否绑定事件 */
export const once = function (el, event, fn) {
    let listener = function () {
        if (fn) {
            fn.apply(this, arguments)
        }
        off(el, event, listener)
    }
    on(el, event, listener)
}

/* 移除监听事件 */
export const off = (function () {
    if (document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

/* 绑定监听事件 */
export const on = (function () {
    if (document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()

/* 清除左右空格 */
const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* 是否有某个class名 */
export function hasClass(el, cls) {
    if (!el || !cls) return false
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
    if (el.classList) {
        return el.classList.contains(cls)
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
    }
}

/* 追加class */
export function addClass(el, cls) {
    if (!el) return
    let curClass = el.className
    let classes = (cls || '').split(' ')

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i]
        if (!clsName) continue

        if (el.classList) {
            el.classList.add(clsName)
        } else {
            if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName
            }
        }
    }
    if (!el.classList) {
        el.className = curClass
    }
}

/* 移除class */
export function removeClass(el, cls) {
    if (!el || !cls) return
    let classes = cls.split(' ')
    let curClass = ' ' + el.className + ' '

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i]
        if (!clsName) continue

        if (el.classList) {
            el.classList.remove(clsName)
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ')
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass)
    }
}

/**
 * 函数节流方法
 * @param fn 延迟执行的方法
 * @param delay 延迟的时间
 * @param mustRunDelay 间隔时间
 * @returns {Function} 返回执行的回调函数
 */
export function throttle (fn, delay, mustRunDelay = 0) {
    let timer = null;
    let tStart;
    return function () {
        const context = this;
        const args = arguments;
        const tCurr = +new Date();
        clearTimeout(timer);
        if (!tStart) {
            tStart = tCurr;
        }
        if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
            fn.apply(context, args);
            tStart = tCurr;
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}
