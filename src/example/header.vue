<style lang="scss">

</style>

<template>
    <div>
        <v-header title="header" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back">back</v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
    </div>
</template>

<script>
    export default {
    }
</script>
