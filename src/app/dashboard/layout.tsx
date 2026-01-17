"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    Layers,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            } else {
                router.push("/sign-in");
            }
        };
        getUser();
    }, [router]);

    const handleSignOut = async () => {
        // Clear local storage to prevent data leakage to next user
        localStorage.removeItem("habitTrackerState");
        await supabase.auth.signOut();
        router.push("/sign-in");
    };

    const NavContent = () => (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                <Layers className="mr-2 h-6 w-6 text-primary-foreground" />
                <span className="text-lg font-bold text-sidebar-foreground">
                    Habitify
                </span>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-4">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/documents"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard/documents"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Notes
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard/settings"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }`}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
            </div>
            <div className="border-t border-sidebar-border p-4">
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
                                <Avatar className="h-9 w-9 border border-sidebar-border">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                                        {user?.email?.[0].toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-3 flex flex-col items-start overflow-hidden">
                                    <span className="text-xs font-medium text-sidebar-foreground truncate max-w-[120px]">
                                        {user?.email}
                                    </span>
                                    <span className="text-[10px] text-sidebar-foreground/60">
                                        {user?.id}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar Desktop */}
            <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
                <NavContent />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center border-b bg-card/50 px-6 backdrop-blur md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-4">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-sidebar border-r-sidebar-border text-sidebar-foreground w-64">
                            <NavContent />
                        </SheetContent>
                    </Sheet>
                    <span className="text-lg font-bold">Habitify</span>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
