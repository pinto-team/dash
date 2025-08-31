import * as React from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useI18n } from "@/shared/hooks/useI18n"
import { isRTLLocale } from "@/shared/i18n/utils"
import { ROUTES } from "@/app/routes/routes"
import BrandForm from "@/features/brands/components/BrandForm"
import { useCreateBrand } from "@/features/brands/hooks/brands.queries"
import type { CreateBrandRequest } from "@/features/brands/services/brands.api"
import { toast } from "sonner"
import {JSX} from "react";

const FORM_ID = "brand-form"

export default function AddBrandPage(): JSX.Element {
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)
    const create = useCreateBrand()

    const [apiErrors, setApiErrors] = React.useState<ReadonlyArray<{ field: string; message: string }>>([])

    function handleSubmit(values: CreateBrandRequest) {
        setApiErrors([])
        create.mutate(values, {
            onSuccess: (created) => {
                console.log("Brand")
                console.log(created)
                const msg = t("brands.saved_success") ?? "Brand saved successfully"
                toast.success(msg)
                navigate(ROUTES.BRANDS)
            },
            onError: (err) => {
                // Try to extract validation errors
                const resp = (err as { response?: { data?: unknown } }).response?.data as
                    | { code?: number; errors?: Array<{ field: string; message: string }> }
                    | undefined
                if (resp?.code === 422 && Array.isArray(resp.errors)) {
                    setApiErrors(resp.errors)
                } else {
                    const msg = t("common.error") ?? "Something went wrong"
                    toast.error(msg)
                }
            },
        })
    }

    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                    {/* Top bar: Back + Title | Save */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="shadow-none"
                                onClick={() => navigate(-1)}
                                aria-label={t("common.back") ?? "Back"}
                                title={t("common.back") ?? "Back"}
                            >
                                {rtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                            </Button>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t("brands.add") ?? "Add Brand"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                form={FORM_ID}
                                disabled={create.isPending}
                            >
                                {create.isPending ? (t("common.saving") ?? "Saving...") : (t("common.save") ?? "Save")}
                            </Button>
                        </div>
                    </div>

                    {/* Form card */}
                    <BrandForm
                        formId={FORM_ID}
                        onSubmit={handleSubmit}
                        submitting={create.isPending}
                        apiErrors={apiErrors}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
