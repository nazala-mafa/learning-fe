export default defineNuxtPlugin(() => {
    const appUrl = useRuntimeConfig().public.appUrl;

    const toast = useToast();

    const api = $fetch.create({
        baseURL: appUrl,
        async onRequest({ options }) {
            const auth = useAuth();
            if (auth.token) {
                options.headers = new Headers(options.headers);
                options.headers.set('Authorization', `Bearer ${auth.token}`);
            }
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                useAuth().logout()
                navigateTo('/login');
                toast.add({
                    title: 'Unautorized.',
                    description: 'Your Session Expired.'
                })
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})
