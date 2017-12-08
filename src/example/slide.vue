<style lang="scss">
    @import '../assets/styles/scss/function.scss';
    .ui-slide-box{
        height:px(285);margin-bottom:px(40);
    }
</style>

<template>
    <div>
        <v-header title="slide" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        
        <div class="ui-slide-box">
            <v-slide :show-pagination="0" :showPagination="1">
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
    
        <div class="ui-slide-box">
            <v-slide :showPagination="2">
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
    </div>
</template>

<script>

    export default {

    }
</script>
