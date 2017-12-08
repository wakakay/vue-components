<style lang="scss">

</style>

<template>
    <div>
        <v-header title="toast" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:100px 20px;">
            <v-button size="large" type="primary" @click="toast">点击弹出toast</v-button>
        </div>
    </div>
</template>

<script>
    import toast from '@/components/toast'
    export default {
        methods:{
            toast() {
                toast({
                    message: '提示文案',
                    duration:'2000'
                });
            },
        }
    }
</script>
