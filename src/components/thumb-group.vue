<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';

    .ui-thumb-group {
        display:block;min-height: px(186);border-bottom:1px solid $border-color;
        &:active{ background:$active-background-color;}
        .cell-thumb-group-box{
            padding: px(18) px(20);
            .cell-content{
                h3{
                    height:px(92);padding-right:px(10);font-size:px(30);color:$color-black;line-height:px(46);overflow:hidden;
                }
                p{height:px(40);margin-bottom:px(4);font-size:px(22);color:$color-medium-grey;line-height:px(40);overflow:hidden;}
            }
            
            .cell-thumb{width:px(200);height:px(150);margin-left:px(20);}
            &[flex='dir:right']{
                .cell-thumb{margin:0 px(20) 0 0;}
            }
            &[flex='dir:top']{
                .cell-content{
                    h3{height:auto;}
                }
                .cell-thumb{
                    width:100%;margin:px(5) px(-10);
                    span{
                        margin:0 px(10);background-color: #e6e6e6;
                    }
                }
            }
        }
    }
</style>

<template>
    <router-link :to="getHref" class="ui-thumb-group" ref="thumbGroup">
        <div class="cell-thumb-group-box" v-bind:flex="flexType">
            <div class="cell-content" flex-box="1" flex="dir:top">
                <h3 flex-box="1" v-text="title+thumbsList.length"></h3>
                <p flex-box="0" v-show="showType!=3" v-text="subTitle"></p>
            </div>
            
            <div class="cell-thumb" flex-box="0" flex="box:mean">
                <span v-for="item in thumbsList">
                    <img :src="item"/>
                </span>
            </div>
        
            <div class="cell-content" v-show="showType==3">
                <p flex-box="0" v-text="subTitle"></p>
            </div>
        </div>
    </router-link>
</template>

<script type="text/ecmascript-6">
    /**
     * v-thumb-group
     * @module components/thumb-group
     * @desc 图片列表
     * @param {toLink} [String] - 路由链接的名称---【''】
     * @param {isLink} [Boolean] - 是否是链接---【true】 如果有父组件有对链接进行控制的话，必须设置为false
     * @param {title} [String] - 左边文字---【''】
     * @param {subTitle} [String] - 右边位子---【''】
     * @param {thumbs} [Array] - 图片缩略图地址---【''】
     * @param {showType} [Number, String] - ui展示形式---【1】 只有3种,第三种可以展示三张图片，其他只有1张，多余的不展示
     *
     * @example
     * <v-thumb-group></v-thumb-group>
     */
    export default {
        name: 'thumb-group',
    
        props: {
            toLink: String,
            isLink: {
                type: Boolean,
                default: true
            },
            title: String,
            subTitle: String,
            thumbs: [Array, String],
            showType: {
                type: Number,
                default: 1
            }
        },
        
        data() {
            return {
                flexType: null,  // 展示ui类型
                thumbsList: [],  // 展示的图片
            }
        },
    
        mounted() {
            let self = this;
            // 过滤缩略图的数据格式
            if (typeof self.thumbs === 'string') {
                self.thumbsList.push(self.thumbs);
            } else if (self.thumbs instanceof Array) {
                self.thumbsList = self.thumbs;
            }
            // 转化参数信息
            switch (self.showType) {
                case 1:
                    self.flexType = 'dir:left';
                    self.thumbsList.length = 1;
                    break;
                case 2:
                    self.flexType = 'dir:right';
                    self.thumbsList.length = 1;
                    break;
                case 3:
                    self.flexType = 'dir:top';
                    self.thumbsList.length = 3;
                    break;
                default:
                    self.flexType = 'dir:left';
                    self.thumbsList.length = 1;
                    break;
            }
        },
    
        computed: {
            // 超链接处理
            getHref() {
                let self = this;
                // 不做链接获取没有链接地址则取消超链接
                if (!self.isLink || !self.toLink) return '';
                if (self.toLink && self.$router) {
                    let resolved = self.$router.match(self.toLink);
                    if (!resolved.matched.length) {
                        return self.toLink;
                    }
                    return resolved.path;
                }
                return self.toLink;
            }
        },
    
        methods: {
        
        }
    }
</script>
