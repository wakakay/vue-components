<style lang="scss">

</style>

<template>
    <div>
        <v-header title="progress" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        
        <div style="padding:100px 20px;">
            <v-progress></v-progress>
            <v-progress :value="20" title="进度条"></v-progress>
            <v-progress :value="40">
                <div slot="start">0%</div>
                <div slot="end">100%</div>
            </v-progress>
            <v-progress :value="60" :bar-height=".1" title="进度条"></v-progress>
            <v-button size="large" type="primary" @click.native="uploadFile">上传文件</v-button>
            <v-progress :value="value" v-if="progressVisible">
                <div slot="end">{{ value }}%</div>
            </v-progress>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                progressVisible: false,
                value: 0,
                uploading: false,
                timer: null
            }
        },
        methods: {
            uploadFile() {
                if (!this.uploading) {
                    this.value = 0;
                    this.progressVisible = true;
                    this.uploading = true;
                    this.timer = setInterval(() => this.value++, 10);
                }
            }
        },
        watch: {
            value(val) {
                if (val >= 100) {
                    this.uploading = false;
                    this.progressVisible = false;
                    setTimeout(() => toast({ message: '上传成功', position: 'bottom', duration: 1000 }), 200);
                    clearTimeout(this.timer);
                }
            }
        }
    }
</script>
