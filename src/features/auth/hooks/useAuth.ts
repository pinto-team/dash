// features/auth/hooks/useAuth.ts
import { useContext } from 'react'

import { AuthContext } from '@/app/providers/auth/auth-context.ts'

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
