<style lang="scss" rel="stylesheet/scss" scoped>

</style>

<template>
	<div>
        <v-header title="list-group" fixed>
            <router-link to="/" slot="left">
                <v-button icon="back"></v-button>
            </router-link>
        </v-header>
        
        <v-list-group icon="search" title="只有标题" toLink="/">
            <slot name="icon"></slot>
        </v-list-group>
        
        <v-list-group icon="edit" title="只哇咔咔" subTitle="哇咔咔滴喲" colorStyle="color:#f90" :isLink="false">
            <slot name="icon"></slot>
        </v-list-group>
        
        <v-list-group title="哇咔咔" subTitle="哇咔咔滴喲" colorStyle="color:#de0001" :isLink="false">
            <slot name="icon"></slot>
        </v-list-group>
    </div>
</template>

<script type="text/ecmascript-6">

</script>
