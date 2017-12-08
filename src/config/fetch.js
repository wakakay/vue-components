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
import axios from 'axios'
import Qs from 'qs'
import {baseUrl} from './env'
import * as api from './service'

axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = baseUrl

// 请求拦截器
axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.data = Qs.stringify(config.data)
    }
    return config
}, (error) => {
    // console.log('错误的传参', 'fail')
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((response) => {
    // 请求成功,根据接口固定返回的一个字段判断
    if (!response.data.status) {
        // console.log(res.data.msg);
        return Promise.reject(response)
    }
    // 请求失败
    return response
}, (error) => {
    // console.log('网络异常', 'fail')
    return Promise.reject(error)
})

/**
 * 请求封装
 * @param actionObj {method: 请求类型, url: 请求地址, params: 请求参数}
 * @returns {Promise}
 */
export function fetch(actionObj) {
    let methods = actionObj.method.toLowerCase()
    let VueAxios = null
    // 过滤出请求的类型
    switch (methods) {
        case 'post':
            VueAxios = axios.post(actionObj.url, actionObj.params)
            break
        case 'get':
            VueAxios = axios.get(actionObj.url, actionObj.params)
            break
        case 'request':
            VueAxios = axios.request(actionObj.url, actionObj.params)
            break
        case 'delete':
            VueAxios = axios.delete(actionObj.url, actionObj.params)
            break
        case 'options':
            VueAxios = axios.options(actionObj.url, actionObj.params)
            break
        case 'put':
            VueAxios = axios.put(actionObj.url, actionObj.params)
            break
        case 'patch':
            VueAxios = axios.patch(actionObj.url, actionObj.params)
            break
        default :
            VueAxios = axios.post(actionObj.url, actionObj.params)
            break
    }
    let promise = new Promise((resolve, reject) => {
        VueAxios.then(response => {
            // console.log('请求成功')
            resolve(response.data)
        }).catch((error) => {
            // console.log('请求失败')
            reject(error)
        })
    })

    return promise
}

export default {
    user(name, params) {
        return fetch(api.user[name](params))
    }
}
