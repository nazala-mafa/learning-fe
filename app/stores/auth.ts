import { defineStore } from "pinia";
import type { User } from "~/types/user";

interface AuthState {
    user: User | null
    token: string | null
}

export const useAuth = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: null,
    }),
    actions: {
        setUser(user: User | null) {
            this.user = user;
        },
        setToken(token: string | null) {
            this.token = token;
        },
        logout() {
            this.user = null;
            this.token = null;
        },
    },
    persist: true,
})
