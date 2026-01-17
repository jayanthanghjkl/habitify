'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // Uses the browser client
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function SignOutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        try {
            setLoading(true)

            // Clear legacy local storage if present
            localStorage.removeItem("habitTrackerState")

            const { error } = await supabase.auth.signOut()
            if (error) throw error

            router.refresh()
            router.push('/sign-in')
        } catch (error: any) {
            toast.error('Error signing out')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={loading}
            className="w-full sm:w-auto"
        >
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
    )
}
