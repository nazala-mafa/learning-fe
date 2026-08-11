import { defineNuxtRouteMiddleware } from "nuxt/app";
import { useAuth } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const authGuest = ['login', 'sign-up'] // white listed route names

    if (typeof(to?.name) === 'string' && !authGuest.includes(to?.name)) {
        const auth = useAuth();
        if (auth.user === null) {
            useToast().add({
                title: 'Unauthenticated',
                description: 'Please log in to continue',
            })
            return navigateTo('/login');
        }
    }
})