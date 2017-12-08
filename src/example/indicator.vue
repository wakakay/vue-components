<style lang="scss">

</style>

<template>
    <div>
        <v-header title="indicator" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:100px 20px;">
            <v-button size="large" type="primary" @click="indicator">点击弹出indicator</v-button>
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            indicator() {
                indicator.open('加载中');
                setTimeout(function(){
                    indicator.close();
                }, 3000)
            },
        }
    }
</script>
