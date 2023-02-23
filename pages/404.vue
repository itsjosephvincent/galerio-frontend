<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Error 404</Title>
        </Head>

        <div class="flex flex-col items-center justify-center py-20 space-y-6">
            <img src="/assets/img/error/404.svg" alt="Image failed to load." class="w-96 sm:w-56 xs:w-56">
            <h3 class="text-4xl max-w-5xl text-center md:max-w-2xl md:text-2xl sm:text-lg xs:text-lg">
                Page not found
            </h3>
            <div>
                <FormButton buttonStyle="primary" @click="navigateTo('/')">
                    Back to home
                </FormButton>
            </div>
        </div>

    </NuxtLayout>
</template>