import App from '../app'

export default [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/login', // 登录
                component: resolve => require(['../pages/users/login.vue'], resolve)
            },
            {
                path: '/user-info', // 个人主页
                component: resolve => require(['../pages/users/user.vue'], resolve)
            },
            {
                path: '/index', // 组件首页
                component: resolve => require(['../example/index.vue'], resolve)
            },
            {
                path: '/cell-swipe', // 滑块
                component: resolve => require(['../example/cell-swipe.vue'], resolve)
            },
            {
                path: '/list-group', // 文本列表
                component: resolve => require(['../example/list-group.vue'], resolve)
            },
            {
                path: '/thumb-group', // 图文列表
                component: resolve => require(['../example/thumb-group.vue'], resolve)
            },
            {
                path: '/infinite-scroll', // 滚动刷新加载
                component: resolve => require(['../example/infinite-scroll.vue'], resolve)
            },
            {
                path: '/actionsheet',
                component: resolve => require(['../example/action-sheet.vue'], resolve)
            },
            {
                path: '/alert',
                component: resolve => require(['../example/alert.vue'], resolve)
            },
            {
                path: '/button',
                component: resolve => require(['../example/button.vue'], resolve)
            },
            {
                path: '/header',
                component: resolve => require(['../example/header.vue'], resolve)
            },
            {
                path: '/indicator',
                component: resolve => require(['../example/indicator.vue'], resolve)
            },
            {
                path: '/progress',
                component: resolve => require(['../example/progress.vue'], resolve)
            },
            {
                path: '/search',
                component: resolve => require(['../example/search.vue'], resolve)
            },
            {
                path: '/slide',
                component: resolve => require(['../example/slide.vue'], resolve)
            },
            {
                path: '/toast',
                component: resolve => require(['../example/toast.vue'], resolve)
            },
            {
                path: '/badge',
                component: resolve => require(['../example/badge.vue'], resolve)
            },
            {
                path: '/switch',
                component: resolve => require(['../example/switch.vue'], resolve)
            },
            {
                path: '*',
                redirect: '/index'
            }
        ]
    }
]
