import { createClient } from '@/utils/supabase/server'
import { SignOutButton } from './sign-out-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Your current account information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <div className="text-base font-medium">{user?.email || 'Unknown'}</div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-gray-500">User ID</label>
                        <div className="text-xs font-mono text-gray-400 bg-gray-100 p-2 rounded-md w-fit">
                            {user?.id}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-100">
                <CardHeader>
                    <CardTitle className="text-red-900">Danger Zone</CardTitle>
                    <CardDescription className="text-red-700/80">
                        Sign out of your account on this device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignOutButton />
                </CardContent>
            </Card>
        </div>
    )
}
