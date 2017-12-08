<style lang="scss" rel="stylesheet/scss" scoped>

</style>

<template>
	<div>
        <v-header title="thumb-group" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
        </v-header>
        
        <v-thumb-group :showType="1" toLink="/"
                       title="侠客岛：特朗普放大招美国大幅减税 中国如何应对"
                       subTitle="上任一年，特朗普终于打了个漂亮的翻身仗。"
                       :thumbs="thumbsList">
        </v-thumb-group>
        
        <v-thumb-group :showType="2" toLink="/"
                       title="侠客岛：特朗普放大招美国大幅减税 中国如何应对"
                       subTitle="上任一年，特朗普终于打了个漂亮的翻身仗。"
                       :thumbs="thumbsList">
        </v-thumb-group>
        
        <v-thumb-group :showType="3" :isLink="false"
                       title="81岁老太捡垃圾养4条命:村里过不下去 进城求活路"
                       subTitle="81岁老太捡垃圾养4条命:村里过不下去 进城求活路"
                       :thumbs="thumbsList3">
        </v-thumb-group>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                thumbsList: ['http://cms-bucket.nosdn.127.net/1c58a7b0531e417fb5e5c2863518324620171204014907.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1'],
                thumbsList3: [
                    'http://cms-bucket.nosdn.127.net/8648c78419b0468a8f45a463df57c2a620171204084702.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1',
                    'http://cms-bucket.nosdn.127.net/ba3e04c55c6949b8814068457418287420171204084702.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1',
                    'http://cms-bucket.nosdn.127.net/ab56986271eb4917a9a03ec8b22e416420171204084702.png?imageView&thumbnail=220y165&quality=45&type=webp&interlace=1&enlarge=1'
                ]
            }
        },
        
        methods: {
            getClick(e) {
            
            }
        }
    }
</script>
