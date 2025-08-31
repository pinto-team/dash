import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx"
import { SiteHeader } from "@/components/layout/site-header.tsx"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import React from "react";

export default function Page() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
