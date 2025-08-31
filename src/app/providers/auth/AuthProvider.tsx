import { AuthContext } from "./auth-context"
import {apiLogin, apiMe, apiRefresh} from "@/features/auth/services/auth.api.ts";
import {HttpError} from "@/lib/http-error.ts";
import {
    getAccessToken,
    getRefreshToken,
    getCachedUser,
    setCachedUser,
    setTokens,
    clearAuthStorage,
} from "@/features/auth/storage.ts"
import {ReactNode, useEffect, useState} from "react";
import {AuthUser} from "@/features/auth/types.ts";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [accessToken, setAT] = useState<string | null>(null)
    const [refreshToken, setRT] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    // bootstrap
    useEffect(() => {
        const at = getAccessToken()
        const rt = getRefreshToken()
        const cachedUser = getCachedUser<AuthUser>()

        if (at && cachedUser) {
            setAT(at)
            setRT(rt)
            setUser(cachedUser)
            setReady(true)

            apiMe(at).catch(async () => {
                if (rt) {
                    try {
                        const r = await apiRefresh(rt)
                        setAT(r.accessToken)
                        setRT(r.refreshToken)
                        setTokens(r.accessToken, r.refreshToken)
                    } catch {
                        hardLogout()
                    }
                } else {
                    hardLogout()
                }
            })
        } else {
            setReady(true)
        }
    }, [])

    function hardLogout() {
        setUser(null)
        setAT(null)
        setRT(null)
        clearAuthStorage()
    }

    async function login({ username, password }: { username: string; password: string }) {
        try {
            const r = await apiLogin(username, password)
            setAT(r.accessToken)
            setRT(r.refreshToken)

            const u: AuthUser = {
                id: r.id,
                username: r.username,
                email: r.email,
                firstName: r.firstName,
                lastName: r.lastName,
                image: r.image,
            }

            setUser(u)
            setTokens(r.accessToken, r.refreshToken)
            setCachedUser(u)
        } catch (err: unknown) {
            if (err instanceof HttpError) throw new Error(err.message)
            if (err instanceof Error) throw err
            throw new Error("Unknown login error")
        }
    }

    function logout() {
        hardLogout()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                isAuthenticated: Boolean(user && accessToken),
                ready,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}