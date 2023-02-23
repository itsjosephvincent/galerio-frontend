export default defineNuxtRouteMiddleware((to) => {
    if (localStorage.getItem("_token") === null || sessionStorage.getItem('userStore') === null) {
        if (to.path !== '/cms') {
            return navigateTo('/cms')
        }
    }
    else {
        if (to.path === '/cms') {
            return navigateTo('/cms/landing')
        }
    }
})

