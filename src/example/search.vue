<style lang="scss">

</style>

<template>
    <div>
        <v-header title="search" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        
        <div style="clear:both">
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
    </div>
</template>

<script>
    import {localStorage} from '../config/session'
    export default {
        data() {
            return {
                searchValue: '',
                filterDataList: [],
                historyDataList: [],
                hotDataList: [{title: '热卖的哇'}, {title: '热卖的呦'}, {title: '热卖的哇咔咔'}]
            }
        },
        created() {
            // 获取localStorage的搜索记录
            this.historyDataList = localStorage.getItem('searchKeyword') || [];
        },

    methods: {
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
