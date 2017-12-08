/**
 * @file
 * @author: lzb
 * @params: 参数说明
 * @history:
 * Date      Version Remarks
 * ========= ======= ==================================
 * 2017/10/26       1.0     First version
 *
 */

// localStorage 存储
export const localStorage = {
    /**
     * 设置 localStorage
     * @param key
     * @param value
     * @param isJson 是否需要转化成json格式，默认是true
     */
    setItem: (key, value, isJson) => {
        if (!key) return
        let resetValue = value
        let isToJson = getIsBoolean(isJson)
        if (isToJson) {
            resetValue = JSON.stringify(value)
        }
        window.localStorage.setItem(key, resetValue)
    },

    /**
     * 获取 localStorage
     * @param key
     * @param isJson isJson 是否需要json对象，默认是true
     * @returns {*}
     */
    getItem: (key, isJson) => {
        let resetValue = window.localStorage.getItem(key)
        let isToJson = getIsBoolean(isJson)
        if (isToJson) {
            resetValue = JSON.parse(resetValue)
        }
        return resetValue
    },

    /**
     * 删除某个 localStorage
     * @param key
     */
    removeItem: (key) => {
        window.localStorage.removeItem(key)
    },

    /**
     * 删除所有的 localStorage
     */
    clear: () => {
        window.localStorage.clear()
    }
}

// sessionStorage 存储
export const sessionStorage = {
    /**
     * 设置 sessionStorage
     * @param key
     * @param value
     * @param isJson 是否需要转化成json格式，默认是true
     */
    setItem: (key, value, isJson) => {
        if (!key) return
        let resetValue = value
        let isToJson = getIsBoolean(isJson)
        if (isToJson) {
            resetValue = JSON.stringify(value)
        }
        window.sessionStorage.setItem(key, resetValue)
    },

    /**
     * 获取 sessionStorage
     * @param key
     * @param isJson isJson 是否需要json对象，默认是true
     * @returns {*}
     */
    getItem: (key, isJson) => {
        let resetValue = window.sessionStorage.getItem(key)
        let isToJson = getIsBoolean(isJson)
        if (isToJson) {
            resetValue = JSON.parse(resetValue)
        }
        return resetValue
    },

    /**
     * 删除某个 sessionStorage
     * @param key
     */
    removeItem: (key) => {
        window.sessionStorage.removeItem(key)
    },

    /**
     * 删除所有的 sessionStorage
     */
    clear: () => {
        window.sessionStorage.clear()
    }
}

export const getIsBoolean = (boolean) => {
    if (typeof boolean === 'boolean') {
        return boolean
    } else if (typeof boolean === 'number' && boolean <= 0) {
        return false
    } else {
        return true
    }
}
