import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Circle,
  ClipboardList,
  History,
  MessageCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDashboard } from "@/hooks/useDashboard";
import { useTodayExpenses } from "@/hooks/useRevenue";
import { useActivation } from "@/hooks/useActivation";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coachmark, useCoachmark } from "@/components/ui/coachmark";
import { formatRupiah } from "@/lib/laundrySite";

export function HomePage() {
  usePageTitle("Dashboard Outlet");
  const { currentStore, isOwner } = useStore();
  const { user } = useAuth();
  const { metrics, recentOrders, loading, refreshData } = useDashboard();
  const expenses = useTodayExpenses();
  const { data: activation } = useActivation();
  const { shouldShowCoachmark, hideCoachmark } = useCoachmark();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting =
    hour < 10
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";
  const actions = [
    {
      label: "Riwayat pesanan",
      description: "Pantau status cucian",
      icon: History,
      path: "/order-history",
    },
    {
      label: "Pelanggan",
      description: "Data & riwayat pelanggan",
      icon: Users,
      path: "/customers",
    },
    {
      label: "Pengeluaran",
      description: "Catat biaya operasional",
      icon: Wallet,
      path: "/expenses",
    },
    ...(isOwner
      ? [
          {
            label: "Layanan & harga",
            description: "Kelola katalog outlet",
            icon: Wrench,
            path: "/services",
          },
          {
            label: "Toko",
            description: "Informasi & pengaturan",
            icon: Building2,
            path: "/stores",
          },
          {
            label: "Laporan pendapatan",
            description: "Lihat rekap transaksi",
            icon: TrendingUp,
            path: "/revenue-report",
          },
          {
            label: "Broadcast WhatsApp",
            description: "Komunikasi pelanggan",
            icon: MessageCircle,
            path: "/whatsapp-broadcast",
          },
        ]
      : []),
    {
      label: "Pesanan batal",
      description: "Tinjau pesanan dibatalkan",
      icon: ClipboardList,
      path: "/order-history?status=cancelled",
    },
  ];
  const onboarding = [
    ...(isOwner
      ? [
          {
            label: "Informasi toko",
            detail: "Periksa alamat dan nomor kontak.",
            done: true,
            path: "/stores",
          },
          {
            label: "Layanan & harga",
            detail: "Siapkan layanan sebelum mencatat pesanan.",
            done: !!activation?.hasServices,
            path: "/services",
          },
        ]
      : []),
    {
      label: "Pesanan pertama",
      detail: "Mulai mencatat cucian pelanggan.",
      done: !!activation?.hasOrder,
      path: "/pos",
    },
    {
      label: "Daftar pelanggan",
      detail: "Simpan pelanggan untuk pesanan berikutnya.",
      done: !!activation?.hasCustomer,
      path: "/customers",
    },
  ];
  const statusLabels: Record<string, string> = {
    in_queue: "Dalam antrean",
    in_progress: "Diproses",
    completed: "Selesai",
    ready_for_pickup: "Siap diambil",
    cancelled: "Dibatalkan",
  };

  if (!currentStore)
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="text-xl font-bold">Pilih outlet terlebih dahulu</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Gunakan pemilih toko untuk membuka dashboard outlet Anda.
          </p>
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6 sm:space-y-8">
      <Coachmark
        open={shouldShowCoachmark}
        onClose={hideCoachmark}
        onStart={() => navigate("/pos")}
      />
      <section className="flex flex-col gap-6 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <p className="text-sm text-white/90">
            {greeting}, {user?.full_name?.split(" ")[0] || "pengelola"}.
          </p>
          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
            {currentStore.store_name}
          </h1>
          <p className="mt-2 text-sm text-white/90">
            Kelola cucian, pelanggan, dan transaksi hari ini.
          </p>
        </div>
        <Button
          className="shrink-0 bg-white text-primary shadow-none hover:bg-secondary"
          size="lg"
          onClick={() => navigate("/pos")}
        >
          <Plus aria-hidden="true" />
          Buat Pesanan
        </Button>
      </section>
      {!loading && !metrics && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-sm">
              Ringkasan belum tersedia. Periksa koneksi lalu muat ulang.
            </p>
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw aria-hidden="true" />
              Muat ulang
            </Button>
          </CardContent>
        </Card>
      )}
      <section
        aria-label="Ringkasan outlet hari ini"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          {
            label: "Pendapatan hari ini",
            value: metrics ? formatRupiah(metrics.todayRevenue.amount) : "-",
            loading,
          },
          {
            label: "Pengeluaran hari ini",
            value: expenses.isError
              ? "Belum tersedia"
              : formatRupiah(expenses.data || 0),
            loading: expenses.isLoading,
          },
          {
            label: "Pesanan hari ini",
            value: metrics?.todayOrders.count ?? "-",
            loading,
          },
          {
            label: "Dalam antrean",
            value: metrics?.pendingOrders.count ?? "-",
            loading,
          },
        ].map((metric) => (
          <Card key={metric.label} className="shadow-none">
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p
                className="mt-3 break-words text-lg font-bold tracking-tight sm:text-2xl"
                aria-live="polite"
              >
                {metric.loading ? "Memuat..." : metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      {activation && !activation.isActivated && (
        <Card className="shadow-none">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">Siapkan outlet Anda</h2>
              <span className="text-xs text-muted-foreground">
                {onboarding.filter((step) => step.done).length}/
                {onboarding.length} langkah
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {onboarding.map((step) => (
                <button
                  key={step.label}
                  onClick={() => navigate(step.path)}
                  className="flex items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-secondary"
                >
                  {step.done ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-pos-success" />
                  ) : (
                    <Circle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <span>
                    <strong className="block text-sm">{step.label}</strong>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {step.detail}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <section>
        <h2 className="mb-4 text-lg font-bold">Aktivitas outlet</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary hover:bg-secondary"
            >
              <action.icon
                className="mt-1 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <strong className="block text-sm font-semibold">
                  {action.label}
                </strong>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {action.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Pesanan terbaru</h2>
          <Button
            variant="link"
            className="px-0"
            onClick={() => navigate("/order-history")}
          >
            Lihat riwayat
          </Button>
        </div>
        <Card className="shadow-none">
          <CardContent className="p-0">
            {loading ? (
              <p role="status" className="p-6 text-sm text-muted-foreground">
                Memuat pesanan...
              </p>
            ) : !recentOrders.length ? (
              <div className="p-6 text-center">
                <ClipboardList className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">
                  Belum ada pesanan yang ditampilkan
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Catat pesanan baru untuk mulai mengisi riwayat outlet.
                </p>
                <Button onClick={() => navigate("/pos")} className="mt-4">
                  Buat Pesanan
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentOrders.slice(0, 5).map((order) => (
                  <li key={order.id}>
                    <button
                      onClick={() => navigate("/order-history")}
                      className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-secondary"
                    >
                      <span className="min-w-0">
                        <strong className="block break-words text-sm">
                          {order.customer_name}
                        </strong>
                        <span className="text-xs text-muted-foreground">
                          {order.service_type}
                        </span>
                      </span>
                      <span className="text-right">
                        <strong className="block text-sm">
                          {formatRupiah(order.total_amount)}
                        </strong>
                        <span className="text-xs text-muted-foreground">
                          {statusLabels[order.execution_status] ||
                            order.execution_status}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
