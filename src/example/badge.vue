<style lang="scss">

</style>

<template>
    <div>
        <v-header title="badge" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:50px;">
            <div>
                <v-badge type="primary" size="large">30</v-badge>
                <v-badge type="error" size="large">10</v-badge>
                <v-badge type="success" size="large">10</v-badge>
                <v-badge type="warning" size="large">10</v-badge>
            </div>
            <br/>
            <div>
                <v-badge type="primary">30</v-badge>
                <v-badge type="error">10</v-badge>
                <v-badge type="success">10</v-badge>
                <v-badge type="warning">10</v-badge>
            </div>
            <br/>
            <div>
                <v-badge type="primary" size="small">30</v-badge>
                <v-badge type="error" size="small">10</v-badge>
                <v-badge type="success" size="small">10</v-badge>
                <v-badge type="warning" size="small">10</v-badge>
            </div>
            <br/>
            <div>
                <v-badge size="small" color="#888">自定义颜色</v-badge>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>
