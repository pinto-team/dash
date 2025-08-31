// features/brands/pages/EditBrandPage.tsx
import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { toast } from "sonner"
import BrandForm from "../components/BrandForm"
import { useBrand, useUpdateBrand, useDeleteBrand } from "../hooks/brands.queries"
import { Button } from "@/components/ui/button"
import type { Brand, CreateBrandRequest } from "../services/brands.api"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useI18n } from "@/shared/hooks/useI18n"
import { ROUTES } from "@/app/routes/routes"
import { defaultLogger } from "@/shared/lib/logger.ts"

function brandToFormDefaults(b?: Brand): Partial<CreateBrandRequest> {
    if (!b) return {}
    return {
        name: b.name ?? "",
        description: b.description ?? "",
        country: b.country ?? "",
        website: b.website ?? "",
        logo_url: b.logo_url ?? "",
    }
}

export default function EditBrandPage() {
    const { id: rawId } = useParams()
    const id = (rawId || "").trim()
    const navigate = useNavigate()
    const { data, isLoading, error } = useBrand(id)
    const update = useUpdateBrand(id)
    const del = useDeleteBrand()
    const { t, locale } = useI18n()
    const rtl = (locale?.toLowerCase?.() ?? "").startsWith("fa")
    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])

    React.useEffect(() => {
        if (isLoading) {
            defaultLogger.info("Loading brand...", { id })
            return
        }
        if (error) {
            defaultLogger.error("Failed to load brand", { id, error: error.message })
            return
        }
        if (data) {
            defaultLogger.info("Brand loaded", { id: data.id, name: data.name })
            console.log("Brand name:", data.name)
        }
    }, [data, isLoading, error, id])

    const formDefaults = React.useMemo(() => brandToFormDefaults(data), [data])

    const handleDelete = React.useCallback(() => {
        if (!id) return
        if (!window.confirm(t("brands.confirm_delete"))) return
        del.mutate(id, {
            onSuccess: () => {
                toast.success(t("brands.deleted"))
                navigate(ROUTES.BRANDS)
            },
            onError: () => toast.error(t("common.error")),
        })
    }, [del, id, navigate, t])

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing)*72)",
                    "--header-height": "calc(var(--spacing)*12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex-1 p-6 md:p-8 lg:p-10">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="shadow-none"
                                onClick={() => navigate(-1)}
                                aria-label={t("common.back")}
                                title={t("common.back")}
                            >
                                {rtl ? (
                                    <ArrowRight className="h-4 w-4" />
                                ) : (
                                    <ArrowLeft className="h-4 w-4" />
                                )}
                            </Button>
                            <h1 className="text-2xl font-bold">{t("brands.edit")}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                form="brand-form"
                                disabled={update.isPending}
                            >
                                {update.isPending ? t("common.saving") : t("common.save")}
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                {t("brands.actions.delete")}
                            </Button>
                        </div>
                    </div>

                    {isLoading || !data ? (
                        <div className="text-sm text-muted-foreground">
                            {t("common.loading")}
                        </div>
                    ) : (
                        <BrandForm
                            key={data.id} // اطمینان از ری‌مونت زمانی که رکورد عوض می‌شود
                            defaultValues={formDefaults}
                            onSubmit={(values) => {
                                setApiErrors([])
                                update.mutate(values, {
                                    onSuccess: () => {
                                        toast.success(t("brands.saved_success"))
                                        navigate(ROUTES.BRANDS)
                                    },
                                    onError: (err) => {
                                        const resp = (
                                            err as { response?: { data?: unknown } }
                                        ).response?.data as
                                            | {
                                            code?: number
                                            errors?: Array<{ field: string; message: string }>
                                        }
                                            | undefined
                                        if (resp?.code === 422 && Array.isArray(resp.errors)) {
                                            setApiErrors(resp.errors)
                                        } else {
                                            toast.error(t("common.error"))
                                        }
                                    },
                                })
                            }}
                            submitting={update.isPending}
                            apiErrors={apiErrors}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
