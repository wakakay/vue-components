<style lang="scss">

</style>

<template>
    <div>
        <v-header title="action-sheet" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:100px 20px;">
            <v-button @click="sheetVisible = true" size="large">点击上拉 action sheet</v-button>
            <v-button @click="sheetVisible2 = true" size="large">不带取消按钮的 action sheet</v-button>
        </div>
        <v-action-sheet :actions="actions" :show.sync="sheetVisible" cancel-text="取消" ></v-action-sheet>
        <v-action-sheet :actions="actions2" :show.sync="sheetVisible2" ></v-action-sheet>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                sheetVisible : false,
                sheetVisible2 : false,
                actions : [
                    {name : '拍照', method : this.takePhoto},
                    {name : '从相册中选择', method : this.openAlbum}
                ],
                actions2 : [
                    {name : '确定'},
                    {name : '返回上一步', method : this.goBack}
                ]
            }
        },
        methods: {
            takePhoto() {
                console.log('打开拍照功能');
            },

            openAlbum() {
                console.log('从相册中选择');
            },

            goBack() {
                console.log('返回上一步');
            }
        },
        mounted() {
            this.actions = [
                {name: '拍照', method: this.takePhoto},
                {name: '从相册中选择', method: this.openAlbum}
            ];
            this.actions2 = [
                {name: '确定'},
                {name: '返回上一步', method: this.goBack}
            ];
        }
    }
</script>
