import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PageLoading } from "./components/ui/loading-spinner";
import { SmartHomePage } from "./pages/SmartHomePage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { StoreProvider } from "./contexts/StoreContext";
import { ThermalPrinterProvider } from "./contexts/ThermalPrinterContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OwnerRoute } from "./components/auth/OwnerRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { queryClient } from "./lib/queryClient";
import { useOfflineOrderSync } from "./hooks/useOfflineOrderSync";
const Index = lazy(() => import("./pages/Index"));
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const OrderHistory = lazy(() =>
  import("./pages/OrderHistoryOptimized").then((module) => ({
    default: module.OrderHistory,
  })),
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const StoreManagementPage = lazy(() =>
  import("./pages/StoreManagementPage").then((module) => ({
    default: module.StoreManagementPage,
  })),
);
const ServiceManagement = lazy(() => import("./pages/ServiceManagement"));
const ExpensesPage = lazy(() =>
  import("./pages/ExpensesPage").then((module) => ({
    default: module.ExpensesPage,
  })),
);
const PublicReceiptPage = lazy(() =>
  import("./pages/PublicReceiptPage").then((module) => ({
    default: module.PublicReceiptPage,
  })),
);
const CustomersPage = lazy(() =>
  import("./pages/CustomersPage").then((module) => ({
    default: module.CustomersPage,
  })),
);
const WhatsAppBroadcastPage = lazy(() =>
  import("./pages/WhatsAppBroadcastPage").then((module) => ({
    default: module.WhatsAppBroadcastPage,
  })),
);
const RevenueReportPage = lazy(() =>
  import("./pages/RevenueReportPage").then((module) => ({
    default: module.RevenueReportPage,
  })),
);

// Mounted once for the app's lifetime: wires the unified offline-sync
// trigger set (online event, focus/visibility, foreground poll) so queued
// orders sync automatically without any per-page setup.
const OfflineSyncEngine = () => {
  useOfflineOrderSync();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfflineSyncEngine />
      <Toaster />
      <Sonner
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            minWidth: "320px",
            maxWidth: "500px",
            width: "90vw",
            padding: "16px",
            fontSize: "16px",
            borderRadius: "12px",
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <ThermalPrinterProvider>
              <Suspense fallback={<PageLoading text="Memuat halaman..." />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<SmartHomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/receipt/:orderId"
                    element={<PublicReceiptPage />}
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <HomePage />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pos"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Index />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-history"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <OrderHistory />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <CustomersPage />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/services"
                    element={
                      <ProtectedRoute>
                        <OwnerRoute>
                          <AppLayout>
                            <ServiceManagement />
                          </AppLayout>
                        </OwnerRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stores"
                    element={
                      <ProtectedRoute>
                        <OwnerRoute>
                          <AppLayout>
                            <StoreManagementPage />
                          </AppLayout>
                        </OwnerRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/whatsapp-broadcast"
                    element={
                      <ProtectedRoute>
                        <OwnerRoute>
                          <AppLayout>
                            <WhatsAppBroadcastPage />
                          </AppLayout>
                        </OwnerRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/revenue-report"
                    element={
                      <ProtectedRoute>
                        <OwnerRoute>
                          <AppLayout>
                            <RevenueReportPage />
                          </AppLayout>
                        </OwnerRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ExpensesPage />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ThermalPrinterProvider>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
