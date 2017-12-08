<style lang="scss" scoped>
  @import '../../assets/styles/scss/function.scss';
  .ui-slide-box{
    height:px(285);
  }
</style>

<template>
    <div>
        <v-header title="我是标题" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            
            <router-link to="/swipe-list" slot="right">
                <v-button icon="setting"></v-button>
            </router-link>
        </v-header>
        
        
        <div class="ui-slide-box">
            <v-slide :show-pagination="0">
                <v-slide-item title="我是第一张"><img
                    src="http://cms-bucket.nosdn.127.net/c25e8671abfd4a99b7ea0986754fdc1420171106104859.jpeg?imageView&thumbnail=750y380&quality=45&type=webp&interlace=1&enlarge=1"/>
                </v-slide-item>
                <v-slide-item title="我是第二张"><img
                    src="http://cms-bucket.nosdn.127.net/3be529beee9f4deca899885e836b1f5e20171106035218.jpeg?imageView&thumbnail=750y380&quality=45&type=webp&interlace=1&enlarge=1"/>
                </v-slide-item>
                <v-slide-item title="我是第三张"><img
                    src="http://cms-bucket.nosdn.127.net/a9e9bfa5e16544b4a8149fdbfc81953320171106020455.jpeg?imageView&thumbnail=750y380&quality=45&type=webp&interlace=1&enlarge=1"/>
                </v-slide-item>
            </v-slide>
        </div>
        
        
        <div style="clear:both;height:220px;">
        </div>
        
        <div style="padding:10px;">
            <p style="margin-bottom:10px;">
                <v-button size="large" type="danger" :disabled="true">888</v-button>
            </p>
            
            <p style="margin-bottom:10px;">
                <v-button size="normal" type="primary">888</v-button>
            </p>
            
            <p style="margin-bottom:10px;">
                <v-button size="small" type="default">888</v-button>
            </p>
        
        </div>
        
        <v-search
            :value="searchValue"
            :isFilterKeyword="filterDataList.length"
            :isShowHistroy="historyDataList.length"
            :isShowHot="hotDataList.length"
            @handleSearch="getSearch"
            @filterKeyword="getFilterData">
            <!---------- 关键字过滤 ---------->
            <v-cell-search
                slot="filterList" v-for="item in filterDataList"
                icon="search" :title="item.title":key="item.id" @click="getSearch(item.title)"></v-cell-search>
            <!---------- 搜索记录 ---------->
            <v-cell-title slot="historyTitle" title="搜索记录">
                <div slot="button">
                    <v-button icon="clear" @click="getClearHistory();"></v-button>
                </div>
            </v-cell-title>
            <v-cell-text
                slot="history" v-for="item in historyDataList" :key="item.id"
                :title="item.title" :column="2"
                @click="getSearch(item.title)"
                ></v-cell-text>
            <!---------- 热门搜索 ---------->
            <v-cell-title slot="hotTitle" title="热门搜索"></v-cell-title>
            <v-cell-text
                slot="hot" v-for="(item, index) in hotDataList" :key="item.id"
                :title="item.title" :numbering="(index+1)+ '. '" :column="1"
                :isGrade="true" @click="getSearch(item.title)"></v-cell-text>
        </v-search>
      
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {localStorage} from '../../config/session'
    import fetch from '../../config/fetch'
    import toast from '@/components/toast'
    import indicator from '@/components/indicator'
    
    export default {
        data() {
            return {
                searchValue: '',
                filterDataList: [],
                historyDataList: [],
                hotDataList: [{title: '热卖的哇'}, {title: '热卖的呦'}, {title: '热卖的哇咔咔'}]
            }
        },
        computed: mapState(
            {userInfo: state => state.userInfo}
        ),
        created() {
            /*toast({
                message: '提示文案',
                duration:'5000',
                position:'top'
            });
            indicator.open('加载中');*/
            
            let postData = {
                state: 112
            }
            fetch.user('textApi', postData).then(response => {
                console.log(99, response)
            }).catch(function (error) {
                console.log(88, error)
            });
            
            // 获取localStorage的搜索记录
            this.historyDataList = localStorage.getItem('searchKeyword') || [];
        },
        
        methods: {
            ...mapActions(['USER_SIGNOUT']),
            getSignout() {
                this.USER_SIGNOUT()
                this.$router.replace({path: '/login'})
            },
            
            // 搜索过滤
            getFilterData(data) {
                if (data == '') {
                    this.filterDataList = [];
                    return;
                }
                this.filterDataList.push({
                    title: data + '哇咔咔'
                });
            },
            
            // 触发搜索
            getSearch(value) {
                let self = this;
                let data = {title: value}
                let flag = _.findIndex(self.historyDataList, data);
                
                self.historyDataList.splice(0, 0, data);
                // 如果已经在搜索列表的话就将被搜索的内容提取到第一个
                flag !== -1 && self.historyDataList.splice(flag+1, 1);
                
                // 最多保留四个历史记录
                if (self.historyDataList.length > 4) {
                    self.historyDataList.length = 4;
                }
                
                // 本地存储到localStorage
                localStorage.setItem('searchKeyword', self.historyDataList);
            },
            
            // 清空历史记录
            getClearHistory () {
                let self = this;
                self.historyDataList = [];
                localStorage.removeItem('searchKeyword');
            }
        }
    }
</script>
