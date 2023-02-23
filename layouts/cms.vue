<template>
    <div>
        <LayoutCMSSidebar :sidebarOpen="state.sidebarOpen" @openSidebar="toggleSidebar" @navigate="navigate" />

        <div class="lg:pl-64 flex flex-col flex-1">
            <LayoutCMSHeader @openSidebar="toggleSidebar" @navigate="navigate" />
            <main class="flex-1 px-10 sm:px-6 xs:px-6">
                <div class="pt-10 pb-6">
                    <div>
                        <h1 class="text-xl font-medium text-gray-600">
                            <slot name="header"></slot>
                        </h1>
                    </div>
                    <div class="mt-6 mb-14">
                        <slot />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
const state = reactive({
    sidebarOpen: false
})

function toggleSidebar(value) {
    state.sidebarOpen = value
}

async function navigate(href) {
    return await navigateTo({
        path: href,
    })
}
</script>
