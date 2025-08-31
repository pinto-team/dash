import { createBrowserRouter } from "react-router-dom"
import AppRoot from "@/app/App"

import LoginPage from "@/features/auth/pages/LoginPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"

// Brands
import BrandsPage from "@/features/brands/pages/BrandsPage"
import AddBrandPage from "@/features/brands/pages/AddBrandPage"
import EditBrandPage from "@/features/brands/pages/EditBrandPage"

import ProtectedRoute from "./ProtectedRoute"
import NotFound from "./NotFound"
import { ROUTES } from "@/app/routes/routes"

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> },                      // پیش‌فرض = داشبورد
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },           // /dashboard

                    // Brands
                    { path: ROUTES.BRANDS, element: <BrandsPage /> },                 // /brands
                    { path: ROUTES.BRAND_NEW, element: <AddBrandPage /> },            // /brands/new
                    { path: ROUTES.BRAND_EDIT(), element: <EditBrandPage /> },        // /brands/:id
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: "*", element: <NotFound /> },
        ],
    },
])
