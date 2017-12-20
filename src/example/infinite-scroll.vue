<style lang="scss" rel="stylesheet/scss">
    @import '../assets/styles/scss/function.scss';
    
    .list {
        font-size: px(30);
    
        li:nth-child(even) {
            background: #eee;
        }
        
        li {
            padding-left: px(20);
            height: px(80);
            line-height: px(80);
            background: #fff;
        
            a {
                display: block;
                height: 100%;
            }
            
            .icon-arrow {
                display: inline-block;
                float: right;
                margin-right: px(20);
                height: 100%;
                width: px(40);
                color: #444;
            }
        }
    }
    
    .view-wrapper {
        box-sizing: border-box;
        padding-top: px(80);
        height: 100%;
        background: #f6f6f6;
    }
    
    .top-load-wrapper, .pull-up {
        line-height: px(80);
        text-align: center;
        background: #f90;
    }
    
    .animation-up {
        display:inline-block;
        transition: .2s;
        transform: rotate(0deg);
    }

    .animation-down {
        display:inline-block;
        transition: .2s;
        transform: rotate(180deg);
    }
    
    .icon-loading {
        transform: rotate(0deg);-webkit-transform: rotate(0deg);
        animation:loading 1.5s linear infinite;
    }

    @keyframes loading{
        from {transform: rotate(0deg);-webkit-transform: rotate(0deg);}
        to {transform: rotate(360deg);-webkit-transform: rotate(360deg);}
    }
    @-webkit-keyframes loading {
        from {transform: rotate(0deg);-webkit-transform: rotate(0deg);}
        to {transform: rotate(360deg);-webkit-transform: rotate(360deg);}
    }
</style>

<template>
    <div>
        <v-header title="infinite-scroll" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
        </v-header>
        
        <v-infinite-scroll
            :pull-down-method="refresh"
            :pull-up-method="loadmoreMethod"
            :pull-up-fail="getAgainLoading">
            <!-- vue 2.5 use slot-scope -->
            <div slot="pull-down" slot-scope="props">
                <div class="top-load-wrapper">
                    <i class=""
                         :class="{
                            'icon-arrow animation-up': props.state == 'pull',
                            'icon-arrow animation-down': props.state === 'trigger',
                            'icon-loading': props.state === 'loading',
                            'icon-succeed': props.state === 'loaded-done'
                         }">
                    </i>
                    <span style="display: inline-block;"> {{props.stateText}}</span>
                </div>
            </div>
            <ul class="list">
                <li v-for="item in dataList" :key="item.id">
                    {{ item }}
                </li>
            </ul>
            
            <div slot="pull-up" slot-scope="props">
                <div class="top-load-wrapper">
                    <i class=""
                         :class="{
                            'icon-arrow animation-down': props.state == 'pull',
                            'icon-arrow animation-up': props.state === 'trigger',
                            'icon-loading': props.state === 'loading',
                            'icon-succeed': props.state === 'loaded-done'
                         }">
                    </i>
                    {{props.stateText}}
                </div>
            </div>
           <!-- <div class="pull-up" v-show="isAddLoad">
                <i class="icon-loading"></i>
                加载中...
            </div>-->
        </v-infinite-scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'simple-pull-to-refresh',
        
        data() {
            return {
                dataList: [
                    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
                ],
                isAddLoad: true, // 是否自动加载
                addCount: 0
            };
        },
        methods: {
            refresh(loaded) {
                setTimeout(() => {
                    this.dataList.reverse();
                    loaded('done');
                }, 6000);
            },
    
            loadmore(loaded) {
                let self = this;
                if (self.addCount == 3) return;
                setTimeout(() => {
                    let a = ['a','q','w','e','r','t','y','u']
                    this.dataList = this.dataList.concat(a);
                    
                    self.addCount++;
                    if (self.addCount == 3) {
                        self.isAddLoad = false;
                    } else {
                        self.isAddLoad = true;
                    }
                    //loaded('done');
                }, 2000);
            },
    
            getAgainLoading(loaded) {
                let self = this;
                setTimeout(() => {
                    let a = ['a','q','w','e','r','t','y','u']
                    self.dataList = self.dataList.concat(a);
                    loaded('done');
                }, 2000);
            },
            
            loadmoreMethod(loaded, status) {
                let self = this;
                setTimeout(() => {
                    if (!status) {
                        loaded('fail');
                        return;
                    }
                    let a = ['a','q','w','e','r','t','y','u']
                    self.dataList = self.dataList.concat(a);3
                }, 2000);
            }
        }
    };
</script>
