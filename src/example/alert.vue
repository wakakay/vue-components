<style lang="scss">

</style>

<template>
    <div>
        <v-header title="alert" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:100px 20px;">
            <v-alert
                icon="succeed"
                type="success">
                提示文案1
            </v-alert>
            <v-alert
                class="aaa"
                icon="error"
                type="error">
                提示文案2
            </v-alert>
            <v-alert
                style="background:#fafafa;"
                icon="warning"
                type="warning">
                提示文案3
            </v-alert>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>
