<template>
    <div class="relative z-10 bg-primary-800 lg:pt-3 md:py-2 sm:py-2 xs:py-2">
        <div class="flex-col hidden lg:flex">
            <div class="flex justify-center items-center gap-x-4">
                <img src="/assets/img/logo.png" class="w-20" alt="Logo" />
                <p class="text-white text-2xl tracking-wide">Galerio Environmental Consultancy Inc.</p>
            </div>
            <div class="max-w-5xl container mx-auto flex items-center justify-between text-white">
                <a v-for="(link, index) in navLinks" :key="index" class="cursor-pointer px-7 pt-7 py-8"
                    :class="link.activeRouteNames.includes($route.name) && 'border-b-2 border-white font-semibold'"
                    @click="navigateToPage(link.href)">
                    {{ link.text }}
                </a>
                <div class="relative cursor-pointer" @click="navigateToPage('contact-us')">
                    <button class="relative px-7 py-3 bg-white text-primary-800 text-sm font-semibold">
                        Contact Us
                    </button>
                    <div class="absolute top-2 -right-2 w-full h-full border border-white"></div>
                </div>
            </div>
        </div>
        <Popover class="relative lg:hidden">
            <div class="flex justify-between items-center px-4 sm:px-6">
                <div class="flex justify-center items-center gap-x-4">
                    <img src="/assets/img/logo.png" class="w-14" alt="Logo" />
                    <p class="text-white text-2xl tracking-wide hidden md:block">Galerio Environmental Consultancy Inc.
                    </p>
                    <p class="text-white text-2xl tracking-wide hidden sm:block xs:block">GEC</p>
                </div>
                <div>
                    <PopoverButton
                        class="border border-white rounded-md p-2 inline-flex items-center justify-center text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-25">
                        <span class="sr-only">Open menu</span>
                        <MenuIcon class="h-6 w-6" aria-hidden="true" />
                    </PopoverButton>
                </div>
            </div>

            <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="duration-100 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <PopoverPanel focus class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right">
                    <div
                        class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        <div class="pt-5 pb-6 px-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <img src="/assets/img/logo.png" class="w-14" alt="Logo" />
                                </div>
                                <div class="-mr-2">
                                    <PopoverButton
                                        class="bg-white rounded-md p-2 inline-flex items-center justify-center text-pr-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800">
                                        <span class="sr-only">Close menu</span>
                                        <XIcon class="h-6 w-6" aria-hidden="true" />
                                    </PopoverButton>
                                </div>
                            </div>
                            <div class="mt-6">
                                <nav class="grid gap-6">
                                    <a v-for="(link, index) in navLinks" :key="index"
                                        class="cursor-pointer -m-3 p-3 flex items-center rounded-lg hover:bg-gray-50"
                                        @click="navigateToPage(link.href)">
                                        <div
                                            class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-primary-800 text-white">
                                            <component :is="link.icon" class="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <div class="ml-4 text-base font-medium text-gray-900">
                                            {{ link.text }}
                                        </div>
                                    </a>
                                    <a class="cursor-pointer -m-3 p-3 flex items-center rounded-lg hover:bg-gray-50"
                                        @click="navigateToPage('/contact-us')">
                                        <div
                                            class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-primary-800 text-white">
                                            <PhoneIcon class="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <div class="ml-4 text-base font-medium text-gray-900">
                                            Contact Us
                                        </div>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </PopoverPanel>
            </transition>
        </Popover>
    </div>
</template>
  
<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import {
    BadgeCheckIcon,
    CollectionIcon,
    FlagIcon,
    HomeIcon,
    LightningBoltIcon,
    MenuIcon,
    OfficeBuildingIcon,
    PhoneIcon,
    RssIcon,
    XIcon,
} from '@heroicons/vue/outline'

const navLinks = [
    {
        text: 'Home',
        icon: HomeIcon,
        activeRouteNames: [
            'index',
        ],
        href: '/'
    },
    {
        text: 'About Us',
        icon: OfficeBuildingIcon,
        activeRouteNames: [
            'about-us',
        ],
        href: '/about-us'
    },
    {
        text: 'Projects',
        icon: CollectionIcon,
        activeRouteNames: [
            'projects',
            'project',
            'projects-slug',
        ],
        href: '/projects'
    },
    {
        text: 'Services',
        icon: BadgeCheckIcon,
        activeRouteNames: [
            'services',
            'services-slug',
        ],
        href: '/services'
    },
    {
        text: 'Trainings',
        icon: LightningBoltIcon,
        activeRouteNames: [
            'trainings',
            'trainings-slug',
        ],
        href: '/trainings'
    },
    {
        text: 'Blogs',
        icon: RssIcon,
        activeRouteNames: [
            'blogs',
            'blogs-slug',
        ],
        href: '/blogs'
    },
    {
        text: 'Career',
        icon: FlagIcon,
        activeRouteNames: [
            'career',
        ],
        href: '/career'
    },
]

function navigateToPage(link) {
    navigateTo(link)
}
</script>