<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';

    .test{height:px(110);}
    .text-p{height:px(80);padding-left:px(40);line-height:px(80);font-size:px(30);color:#f90;}
    .test-group{height: px(186);}
    .my-swipe-btn{font-size:px(30);background-color:#795da3;}
</style>

<template>
	<div>
        <v-header title="cell-swipe" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
        </v-header>
        
        <p class="text-p">没有签入子组件</p>
        <v-cell-swipe :buttons="buttonList" toLink="/" title="教科书式耍赖爆料者母亲得抑郁症 老赖女儿欲自杀">
        </v-cell-swipe>
        
        <p class="text-p">签入子组件一</p>
        <div class="test">
            <v-cell-swipe :buttons="buttonList" toLink="/">
                <slot name="content">
                    <v-list-group icon="edit" title="哇咔咔" subTitle="哇咔咔滴喲" toLink="user-info" :isLink="false">
                        <slot name="icon"></slot>
                    </v-list-group>
                </slot>
            </v-cell-swipe>
        </div>
        
        <p class="text-p">签入子组件二--{{groupList.length}}</p>
        <div class="test-group" v-for="item in groupList" :key="item.id">
            <v-cell-swipe toLink="/" :buttons="item.buttons">
                <slot name="content">
                    <v-thumb-group :showType="item.showType" :isLink="false"
                                   :title="item.title"
                                   :subTitle="item.subTitle"
                                   :thumbs="item.thumbsList">
                    </v-thumb-group>
                </slot>
            </v-cell-swipe>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                buttonList: [{
                    text: '置顶',
                    style: 'background:#000;',
                    handler: () => {alert('置顶')}
                },{
                    text: '标记未读',
                    class: 'my-swipe-btn',
                    handler: () => {alert('标记未读')}
                },{
                    text: '删除',
                    class: 'red',
                    handler: () => {alert('删除')}
                }],
                
                groupList: [
                    {
                        id: 1,
                        showType: 2,
                        title: '环保部发特急函:煤改气(电)未完工可继续燃煤取暖',
                        subTitle: '环保部发特急函:煤改气(电)未完工可继续燃煤取暖',
                        thumbsList: '//cms-bucket.nosdn.127.net/ddf65dd8519441fc992a334db3314a1720171207105501.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1',
                        buttons: [
                            {
                                text: '删除！',
                                class: 'red',
                                handler: () => {
                                    this.getClick(1);
                                }
                            }
                        ]
                    },{
                        id: 2,
                        showType: 1,
                        title: '印度无人飞行器侵入中方领空并坠毁 中国识别查证',
                        subTitle: '印度无人飞行器侵入中方领空并坠毁 中国识别查证',
                        thumbsList: '//cms-bucket.nosdn.127.net/7518bc01600c442a83286d351f3f171220171207101204.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1',
                        buttons: [
                            {
                                text: '删除！',
                                class: 'red',
                                handler: () => {
                                    this.getClick(2);
                                }
                            }
                        ]
                    }
                ]
            }
        },
    
        methods: {
            getClick(id) {
                let self = this;
               
                let index = _.findIndex(self.groupList, function (item) {
                    return item.id == id;
                })
                
                self.groupList.splice(index, 1);
            }
        }
    }
</script>
