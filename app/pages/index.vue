<script setup lang="ts">
    definePageMeta({
        layout: 'dashboard'
    })

    const user = useAuth().user
</script>

<template>
    <title>Boilerplate</title>
    <UMain>
        <h1>Welcome, {{ user?.full_name || user?.username }}.</h1>
    </UMain>
</template>