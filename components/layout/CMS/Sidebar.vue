<template>
    <TransitionRoot as="template" :show="props.sidebarOpen">
        <Dialog as="div" class="relative z-40 lg:hidden" @close="$emit('openSidebar', false)">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </TransitionChild>

            <div class="fixed inset-0 flex z-40">
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full" enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                    leave-to="-translate-x-full">
                    <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                            enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                            leave-to="opacity-0">
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button type="button"
                                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    @click="$emit('openSidebar', false)">
                                    <span class="sr-only">Close sidebar</span>
                                    <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div class="flex items-center flex-col flex-shrink-0 px-4 py-10">
                            <h2 class="text-3xl font-extrabold">GEC CMS</h2>
                            <p class="text-sm">User Portal</p>
                        </div>
                        <div class="mt-5 flex-1 h-0 overflow-y-auto flex flex-col">
                            <nav class="space-y-1 sidebar-nav">
                                <div v-for="item in navigation" :key="item.name" class="cursor-pointer">
                                    <a :class="[
                                        item.activeRouteNames.includes($route.name)
                                            ? 'bg-primary-800 text-white'
                                            : 'text-gray-900 hover:bg-primary-700 hover:text-white',
                                        'group flex items-center px-7 py-4 text-sm font-medium',
                                    ]" v-if="!item.children" @click="$emit('navigate', item.href)">
                                        <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6"
                                            aria-hidden="true" />
                                        {{ item.name }}
                                    </a>
                                    <Disclosure v-else as="div" class="space-y-1" v-slot="{ open }">
                                        <DisclosureButton :class="[
                                            item.activeRouteNames.includes($route.name)
                                                ? 'bg-primary-800 text-white'
                                                : 'text-gray-900 hover:bg-primary-700 hover:text-white',
                                            'w-full flex items-center pl-7 pr-3 py-4 text-sm font-medium',
                                        ]" as="a">
                                            <div class="mr-4">
                                                <!-- Icon goes here -->
                                            </div>
                                            {{ item.name }}
                                            <div class="grow flex items-center justify-end">
                                                <svg :class="[
                                                    open || item.activeRouteNames.includes($route.name) ? 'text-gray-300 rotate-90' : 'text-gray-300',
                                                    'mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-white transition-colors ease-in-out duration-150',
                                                ]" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                        </DisclosureButton>
                                        <DisclosurePanel static
                                            v-show="item.activeRouteNames.includes($route.name) || open">
                                            <DisclosureButton v-for="subItem in item.children" :key="subItem.name"
                                                as="a" @click="$emit('navigate', subItem.href)"
                                                class="group w-full flex items-center pl-12 pr-2 py-4 text-sm font-medium text-gray-900 hover:bg-gray-100"
                                                :class="[subItem.activeRouteNames.includes($route.name) && 'bg-gray-100']">
                                                {{ subItem.name }}
                                            </DisclosureButton>
                                        </DisclosurePanel>
                                    </Disclosure>
                                </div>
                            </nav>
                            <div class="mt-auto pt-10 space-y-1">
                                <a class="flex items-center px-7 py-4 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                    @click="logout()">
                                    <LogoutIcon class="h-6 w-6 mr-3" aria-hidden="true" />
                                    Logout
                                </a>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
                <div class="flex-shrink-0 w-14" aria-hidden="true">
                    <!-- Dummy element to force sidebar to shrink to fit close icon -->
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden w-64 flex-col fixed inset-y-0 lg:flex">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-sidebar overflow-y-auto">
            <div class="flex items-center flex-col flex-shrink-0 px-4 py-10">
                <h2 class="text-3xl font-extrabold">GEC CMS</h2>
                <p class="text-sm">User Portal</p>
            </div>
            <div class="mt-5 flex-grow flex flex-col">
                <nav class="flex-1 pb-4 space-y-1 sidebar-nav">
                    <div v-for="item in navigation" :key="item.name" class="cursor-pointer">
                        <a :class="[
                            item.activeRouteNames.includes($route.name)
                                ? 'bg-primary-800 text-white'
                                : 'text-gray-900 hover:bg-primary-700 hover:text-white',
                            'group flex items-center px-7 py-4 text-sm font-medium',
                        ]" v-if="!item.children" @click="$emit('navigate', item.href)">
                            <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                            {{ item.name }}
                        </a>
                        <Disclosure v-else as="div" class="space-y-1" v-slot="{ open }">
                            <DisclosureButton :class="[
                                item.activeRouteNames.includes($route.name)
                                    ? 'bg-primary-800 text-white'
                                    : 'text-gray-900 hover:bg-primary-700 hover:text-white',
                                'w-full flex items-center pl-7 pr-3 py-4 text-sm font-medium',
                            ]" as="a">
                                <div class="mr-4">
                                    <!-- Icon goes here -->
                                </div>
                                {{ item.name }}
                                <div class="grow flex items-center justify-end">
                                    <svg :class="[
                                        open || item.activeRouteNames.includes($route.name) ? 'text-gray-300 rotate-90' : 'text-gray-300',
                                        'mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-white transition-colors ease-in-out duration-150',
                                    ]" viewBox="0 0 20 20" aria-hidden="true">
                                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </DisclosureButton>
                            <DisclosurePanel static v-show="item.activeRouteNames.includes($route.name) || open">
                                <DisclosureButton v-for="subItem in item.children" :key="subItem.name" as="a"
                                    @click="$emit('navigate', subItem.href)"
                                    class="group w-full flex items-center pl-12 pr-2 py-4 text-sm font-medium text-gray-900 hover:bg-gray-100"
                                    :class="[subItem.activeRouteNames.includes($route.name) && 'bg-gray-100']">
                                    {{ subItem.name }}
                                </DisclosureButton>
                            </DisclosurePanel>
                        </Disclosure>
                    </div>
                </nav>
                <div class="mt-auto pt-10 space-y-1">
                    <a class="flex items-center px-7 py-4 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                        @click="logout()">
                        <LogoutIcon class="h-6 w-6 mr-3" aria-hidden="true" />
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    AnnotationIcon,
    AdjustmentsIcon,
    ClipboardListIcon,
    CollectionIcon,
    DesktopComputerIcon,
    LogoutIcon,
    NewspaperIcon,
    PaperAirplaneIcon,
    PhoneIcon,
    PhotographIcon,
    StarIcon,
    UserGroupIcon,
    XIcon,
} from '@heroicons/vue/outline'
import { useUserStore } from '@/store/user'
import { authService } from '@/components/api/AuthService'

const userStore = useUserStore()

const props = defineProps({
    sidebarOpen: {
        type: Boolean,
        required: true,
    },
})

const emit = defineEmits(['openSidebar', 'navigate'])

const navigation = [
    { name: 'Landing', icon: CollectionIcon, activeRouteNames: ['cms-landing'], href: '/cms/landing' },
    { name: 'About', icon: AnnotationIcon, activeRouteNames: ['cms-about'], href: '/cms/about' },
    {
        name: 'Projects',
        icon: ClipboardListIcon,
        activeRouteNames: [
            'cms-projects',
            'cms-projects-new',
            'cms-projects-edit'
        ],
        href: '/cms/projects'
    },
    {
        name: 'Services',
        icon: AdjustmentsIcon,
        activeRouteNames: [
            'cms-services',
            'cms-services-new',
            'cms-services-edit'
        ],
        href: '/cms/services'
    },
    {
        name: 'Trainings',
        icon: StarIcon,
        activeRouteNames: [
            'cms-trainings',
            'cms-trainings-new',
            'cms-trainings-edit',
            'cms-trainings-certificates',
            'cms-trainings-certificates-new',
            'cms-trainings-certificates-edit',
            'cms-trainings-certificates-trainees',
            'cms-trainings-certificates-trainees-new',
            'cms-trainings-certificates-trainees-edit',
        ],
        href: '/cms/trainings'
    },
    {
        name: 'Blogs',
        icon: NewspaperIcon,
        activeRouteNames: [
            'cms-blogs',
            'cms-blogs-new',
            'cms-blogs-edit'
        ],
        href: '/cms/blogs'
    },
    {
        name: 'Careers',
        icon: PaperAirplaneIcon,
        activeRouteNames: [
            'cms-careers',
            'cms-careers-new',
            'cms-careers-edit'
        ],
        href: '/cms/careers'
    },
    { name: 'Contacts', icon: PhoneIcon, activeRouteNames: ['cms-contacts'], href: '/cms/contacts' },
    {
        name: 'Image Resources',
        icon: PhotographIcon,
        activeRouteNames: [
            'cms-image-resources',
        ],
        href: '/cms/image-resources'
    },
    {
        name: 'Users',
        icon: UserGroupIcon,
        activeRouteNames: [
            'cms-users',
            'cms-users-new',
            'cms-users-edit'
        ],
        href: '/cms/users'
    },
    {
        name: 'Logs',
        icon: DesktopComputerIcon,
        activeRouteNames: [
            'cms-logs',
        ],
        href: '/cms/logs'
    },
]

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