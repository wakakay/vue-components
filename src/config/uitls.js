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

/* 仅绑定可执行一次事件 */
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
export const trim = (function() {
    // native trim is way faster: http://jsperf.com/angular-trim-test
    // but IE doesn't have it... :-(
    // TODO: we should move this into IE/ES5 polyfill
    if (!String.prototype.trim) {
        return function(value) {
            return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
        };
    }
    return function(value) {
        return isString(value) ? value.trim() : value;
    };
})();

/**
 * 是否是数组
 */
/*export const isArray = (function() {
    if (!isFunction(Array.isArray)) {
        return function(value) {
            return toString.call(value) === '[object Array]';
        };
    }
    return Array.isArray;
})();*/

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

/*export function isWindow (obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

export function isObject(value){
    return value != null && typeof value === 'object';
}

export function isFunction(value){
    return typeof value === 'function';
}

export function isString(value){
    return typeof value === 'string';
}

export function isNumber(value){
    return typeof value === 'number';
}

export function isBoolean(value) {
    return typeof value === 'boolean';
}

export function isDate(value) {
    return toString.call(value) === '[object Date]';
}

export function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
}

/!**
 * 深度拷贝
 * @param source 被copy的对象. 可以使任意类型, 包括null和undefined.
 * @param destination copy去的目的地. 可以省略, 如果不省略, 其必须和source是同类
 * @param stackSource
 * @param stackDest
 * @returns {*}
 * @constructor
 *!/
export function vueCopy(source, destination, stackSource, stackDest) {
    if (isWindow(source)) {
        throw ngMinErr('cpws', "Can't copy! Making copies of Window or Scope instances is not supported.");
    }

    if (!destination) {
        destination = source;
        if (source) {
            if (isArray(source)) {
                destination = copy(source, [], stackSource, stackDest);
            } else if (isDate(source)) {
                destination = new Date(source.getTime());
            } else if (isRegExp(source)) {
                destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
                destination.lastIndex = source.lastIndex;
            } else if (isObject(source)) {
                destination = copy(source, {}, stackSource, stackDest);
            }
        }
    } else {
        if (source === destination) throw ngMinErr('cpi', "Can't copy! Source and destination are identical.");

        stackSource = stackSource || [];
        stackDest = stackDest || [];

        if (isObject(source)) {
            var index = indexOf(stackSource, source);
            if (index !== -1) return stackDest[index];

            stackSource.push(source);
            stackDest.push(destination);
        }

        var result;
        if (isArray(source)) {
            destination.length = 0;
            for (var i = 0; i < source.length; i++) {
                result = copy(source[i], null, stackSource, stackDest);
                if (isObject(source[i])) {
                    stackSource.push(source[i]);
                    stackDest.push(result);
                }
                destination.push(result);
            }
        } else {
            var h = destination.$$hashKey;
            if (isArray(destination)) {
                destination.length = 0;
            } else {
                forEach(destination, function (value, key) {
                    delete destination[key];
                });
            }
            for (var key in source) {
                result = copy(source[key], null, stackSource, stackDest);
                if (isObject(source[key])) {
                    stackSource.push(source[key]);
                    stackDest.push(result);
                }
                destination[key] = result;
            }
            setHashKey(destination, h);
        }

    }
    return destination;
}*/
