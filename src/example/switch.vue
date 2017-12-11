<style lang="scss">

</style>

<template>
    <div>
        <v-header title="switch" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
            <div slot="right">
                <v-button icon="setting"></v-button>
            </div>
        </v-header>
        <div style="padding:50px;">
            <div>
                <v-switch v-model="value1" @change="handleChange">
                    <label v-text="value1"></label>
                </v-switch>
                <br/>
                <v-switch v-model="value2" @change="handleChange">
                    <label v-text="value2"></label>
                </v-switch>
                <br/>
                <v-switch v-model="value3" @change="handleChange"></v-switch>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value1: false,
                value2: true,
                value3: false
            };
        },
        methods: {
            handleChange(event) {
                console.log(event);
            }
        }
    };
</script>
