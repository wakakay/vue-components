/**
 * @file
 * @author: lzb
 * @params: 参数说明
 * @history:
 * Date      Version Remarks
 * ========= ======= ==================================
 * 2017/10/27       1.0     First version
 *
 */
export default {
    supplier(params) {
        return fetch({method: 'post', url: '/game/getRule', params: params})
    }
}
