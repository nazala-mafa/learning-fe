export default defineNuxtPlugin(() => {
    const toast = useToast();

    const api = $fetch.create({
        baseURL: '/api',
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
