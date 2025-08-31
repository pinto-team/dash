/**
 * BrandsPage
 * -----------
 * Feature page to list, search, paginate and manage brand entities.
 * - Uses React Query hooks: useBrands (list), useDeleteBrand (mutation)
 * - Respects project architecture: centralized ROUTES, i18n keys, and no hardcoded URLs
 * - Accessible & ESLint-friendly (no `any`, explicit types, stable callbacks)
 */

import * as React from "react";
import { JSX, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
import useDebounced from "@/shared/hooks/useDebounced";
import { toast } from "sonner";
import { useBrands, useDeleteBrand } from "../hooks/brands.queries";
import BrandsTable from "../components/BrandsTable";
import { ROUTES } from "@/app/routes/routes";

export default function BrandsPage(): JSX.Element {
    const { t } = useI18n();
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0); // 0-based UI page
    const [pageSize] = useState<number>(12);
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounced(query, 450);

    const { data, isLoading, error, refetch } = useBrands(pageSize, page + 1, debouncedQuery);
    const items = data?.items ?? [];
    const total = data?.pagination?.total ?? items.length;
    const totalPagesFromApi = data?.pagination?.total_pages;
    const totalPages = useMemo<number>(
        () => Math.max(1, totalPagesFromApi ?? Math.ceil(total / pageSize)),
        [totalPagesFromApi, total, pageSize]
    );
    const hasPrev = data?.pagination?.has_previous ?? page > 0;
    const hasNext = data?.pagination?.has_next ?? page + 1 < totalPages;

    const deleteMutation = useDeleteBrand();

    const layoutStyle = useMemo<React.CSSProperties>(
        () =>
            ({
                "--sidebar-width": "calc(var(--spacing)*72)",
                "--header-height": "calc(var(--spacing)*12)",
            }) as React.CSSProperties,
        []
    );

    const handleCreate = useCallback(() => {
        navigate(ROUTES.BRAND_NEW);
    }, [navigate]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success(t("brands.deleted") || t("common.success"));
                    void refetch();
                },
                onError: () => {
                    toast.error(t("common.error"));
                },
            });
        },
        [deleteMutation, refetch, t]
    );

    const goFirst = useCallback(() => setPage(0), []);
    const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
    const goNext = useCallback(() => setPage((p) => p + 1), []);
    const goLast = useCallback(() => setPage(totalPages - 1), [totalPages]);

    console.log("BrandsPage Data:", { data, items, total, totalPages, error });

    return (
        <SidebarProvider style={layoutStyle}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex items-center justify-between px-4 lg:px-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold">{t("brands.title")}</h1>
                            <p className="text-sm text-muted-foreground">
                                {total > 0
                                    ? t("common.showing_count", { count: total })
                                    : t("common.search_hint")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                aria-label={t("brands.search_placeholder")}
                                placeholder={t("brands.search_placeholder") as string}
                                value={query}
                                onChange={handleSearchChange}
                            />
                            <Button onClick={handleCreate}>{t("brands.create")}</Button>
                        </div>
                    </div>
                    <Separator className="mx-4 lg:mx-6" />
                    <div className="px-4 lg:px-6">
                        {error && <div className="text-red-500">{t("common.error")}: {error.message}</div>}
                        {isLoading && items.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
                        ) : (
                            <BrandsTable items={items} onDelete={handleDelete} />
                        )}
                    </div>
                    <div className="flex items-center justify-between px-4 pb-4 lg:px-6">
                        <div className="hidden lg:block text-sm text-muted-foreground" />
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goFirst}
                                disabled={!hasPrev}
                                aria-label={t("pagination.first")}
                                title={t("pagination.first") as string}
                            >
                                {t("pagination.first")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goPrev}
                                disabled={!hasPrev}
                                aria-label={t("pagination.prev")}
                                title={t("pagination.prev") as string}
                            >
                                {t("pagination.prev")}
                            </Button>
                            <div className="text-sm">
                                {t("pagination.page_of", { page: page + 1, pages: totalPages })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goNext}
                                disabled={!hasNext}
                                aria-label={t("pagination.next")}
                                title={t("pagination.next") as string}
                            >
                                {t("pagination.next")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goLast}
                                disabled={!hasNext}
                                aria-label={t("pagination.last")}
                                title={t("pagination.last") as string}
                            >
                                {t("pagination.last")}
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}