<style lang="scss">

</style>

<template>
    <div>
        <v-header title="button" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>

        <div style="padding:100px 20px;">
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
    </div>
</template>

<script>
    export default {
    }
</script>
