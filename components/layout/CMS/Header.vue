<template>
    <div class="bg-white sticky top-0 z-10 flex-shrink-0 flex h-20 shadow-sm lg:px-8">
        <button type="button"
            class="px-4 border-gray-200 text-gray-500 focus:outline-none focus:ring-0 lg:hidden lg:border-r"
            @click="$emit('openSidebar', true)">
            <span class="sr-only">Open sidebar</span>
            <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-end items-center">
            <div class="ml-4 flex items-center md:ml-6">
                <!-- <div class="lg:mr-10">
                    <button type="button"
                        class="flex items-center bg-white rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0">
                        <IconsNotificationIcon :width="26" :height="26" />
                        <Badge type="notification" value="99+" />
                        <span class="sr-only">View notifications</span>
                    </button>
                </div> -->

                <!-- Profile dropdown -->
                <Menu as="div" class="ml-3 relative">
                    <div>
                        <MenuButton class="max-w-xs bg-white flex items-center text-sm rounded-full gap-x-3">
                            <span class="sr-only">Open user menu</span>
                            <div class="text-base leading-none">
                                <img :src="`https://ui-avatars.com/api/?name=${userStore.getUser && userStore.getUser.first_name + ' ' + userStore.getUser && userStore.getUser.last_name}&size=50&background=095C37&color=FFFFFF&rounded=true&font-size=0.30`"
                                    alt="Image failed to load.">
                            </div>
                            <div class="text-left hidden lg:block md:block">
                                <p class="text-base leading-none">
                                    {{ userStore.getUser && userStore.getUser.first_name }}
                                    {{ userStore.getUser && userStore.getUser.last_name }}
                                </p>
                            </div>
                            <ChevronDownIcon class="h-6 w-6 text-[#292D32] hidden lg:block md:block"
                                aria-hidden="true" />
                        </MenuButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="profile-menu-items origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <MenuItem>
                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-800 hover:text-white"
                                @click="logout()">
                                <LogoutIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                Logout
                            </a>
                            </MenuItem>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>
    </div>
</template>


<script setup>
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/vue'
import {
    ChevronDownIcon,
    LogoutIcon,
    MenuAlt2Icon,
} from '@heroicons/vue/outline'
import { useUserStore } from '@/store/user'
import { authService } from '@/components/api/AuthService'

const userStore = useUserStore()

const emit = defineEmits(['openSidebar'])

async function logout() {
    try {
        const response = await authService.logout()
        if (response) {
            localStorage.removeItem("_token")
            userStore.resetUser()
            navigateTo('/cms')
        }
    } catch (error) {
        state.error = error
    }
}
</script>