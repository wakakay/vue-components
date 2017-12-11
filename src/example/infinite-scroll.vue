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
    
    .top-load-wrapper {
        line-height: px(80);
        text-align: center;
    }
    
    .icon-arrow {
        transition: .2s;
        transform: rotate(180deg);
    }
    
    .icon-loading {
        transform: rotate(0deg);
        animation-name: loading;
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
    
    @keyframes loading
    {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }
</style>

<template>
    <div>
        <v-header title="cell-swipe" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
        </v-header>
        
        <v-infinite-scroll
            :pull-down-method="refresh"
            @top-state-change="stateChange">
            <!-- vue 2.5 use slot-scope -->
            <div slot="pull-down" slot-scope="props">
                <div class="top-load-wrapper">
                    <i class="icon-edit"
                         :class="{
                            'icon-loading': props.state === 'trigger',
                            'icon-loading': props.state === 'loading'
                         }">
                    </i>
                    {{ props.stateText }}
                </div>
            </div>
            <ul class="list">
                <li v-for="item in dataList" :key="item.id">
                    {{ item }}
                </li>
            </ul>
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
                iconLink: ''
            };
        },
        methods: {
            refresh(loaded) {
                setTimeout(() => {
                    this.dataList.reverse();
                    loaded('done');
                }, 1000);
            },
            
            stateChange(state) {
                //console.log(213, state)
                if (state === 'pull' || state === 'trigger') {
                    this.iconLink = '#icon-arrow-bottom';
                } else if (state === 'loading') {
                    this.iconLink = '#icon-loading';
                } else if (state === 'loaded-done') {
                    this.iconLink = '#icon-finish';
                }
            }
        }
    };
</script>
