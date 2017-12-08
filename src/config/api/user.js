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
let token = '?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXWCBTViBBcGkiLCJhdWQiOiJXWCBDbGllbnQiLCJpYXQiOjE1MDk0MTMyOTEsImV4cCI6MTUwOTQ5OTY5MSwidXNlcl9pZCI6MjY5LCJ1c2VyX25hbWUiOiJcdTY2MWZcdTU4NzUiLCJoZWFkX2ltYWdlIjoiaHR0cDpcL1wvd3gucWxvZ28uY25cL21tb3BlblwvdmlfMzJcL1pkcjhIMkNXWUdXU3g3Wnk5VHdQd2p6Y1drQWljTDZQQUZycjl5YmljR3BBRTNZVjJXMFc3R0Jrd2lhODd4R01rSDNkaWNibGJZdE4zdEJXbjloQkx2S1YzZ1wvMCIsImFtb3VudCI6Ijg5NzUuNTAiLCJ0b3BfaWQiOjExMiwiYWRtaW5faWQiOjExMywicGxhdF9pZCI6MTksInBvc3QiOjF9.f2gO4bmop-AkM4_aBsmdCjqjh32urKPlfqDvWm-3PS8'

export default {
    textApi(params) {
        return {method: 'post', url: '/game/getRule' + token, params: params}
    }
}
