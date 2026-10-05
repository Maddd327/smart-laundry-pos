import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  ClipboardList,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Shirt,
  Truck,
  WashingMachine,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePublicLaundry } from "@/hooks/usePublicLaundry";
import { OrderRequestForm } from "@/components/laundry/OrderRequestForm";
import { LaundryWordmark } from "@/components/laundry/LaundryWordmark";
import {
  formatRupiah,
  laundrySite,
  serviceDuration,
  whatsAppLink,
} from "@/lib/laundrySite";
import "./LandingPage.css";

const navigation = [
  ["Layanan", "#layanan"],
  ["Harga", "#harga"],
  ["Cara Kerja", "#cara-kerja"],
  ["Tentang", "#tentang"],
  ["Testimoni", "#testimoni"],
  ["FAQ", "#faq"],
  ["Kontak", "#kontak"],
];
const processSteps = [
  {
    icon: ClipboardList,
    title: "Pilih & kirim detail",
    description: "Tentukan layanan dan isi form pemesanan di website.",
  },
  {
    icon: MessageCircle,
    title: "Konfirmasi bersama",
    description:
      "Outlet mengonfirmasi layanan, jadwal, dan perkiraan biaya di WhatsApp.",
  },
  {
    icon: WashingMachine,
    title: "Serahkan cucian",
    description:
      "Antar pakaian ke outlet. Permintaan antar jemput dibicarakan terlebih dahulu.",
  },
  {
    icon: Shirt,
    title: "Tunggu kabar selesai",
    description:
      "Ikuti informasi dari outlet, lalu ambil pakaian sesuai jadwal yang disepakati.",
  },
];
const questions = [
  [
    "Bagaimana cara memesan laundry?",
    "Pilih layanan, isi nama, nomor WhatsApp, perkiraan berat atau jumlah, dan tanggal di form. Periksa rincian, buka WhatsApp, lalu kirim ke outlet. Pesanan berlaku setelah dikonfirmasi oleh outlet.",
  ],
  [
    "Berapa lama pengerjaan reguler dan express?",
    "Katalog acuan mencantumkan 2 hari untuk Cuci Setrika Regular, 1 hari untuk Express Wash, dan 4 jam untuk Setrika Saja. Lihat estimasi pada layanan yang Anda pilih; jadwal akhir mengikuti konfirmasi dan antrean outlet.",
  ],
  [
    "Apakah ada layanan antar jemput?",
    "Anda dapat mengajukan antar jemput di form. Ketersediaan, jangkauan, jadwal, dan biaya belum dipublikasikan. Pastikan semuanya dikonfirmasi oleh outlet sebelum menunggu penjemputan.",
  ],
  [
    "Apakah harga di website merupakan total akhir?",
    "Harga dihitung berdasarkan layanan dan perkiraan berat atau jumlah yang Anda masukkan. Total akhir dikonfirmasi setelah penimbangan atau pemeriksaan barang. Katalog yang berlabel harga acuan belum merupakan daftar harga outlet yang terverifikasi.",
  ],
  [
    "Bagaimana metode pembayarannya?",
    "Sistem kasir mendukung pencatatan tunai, QRIS, dan transfer. Tanyakan metode yang tersedia di outlet saat konfirmasi. Form website tidak meminta pembayaran atau data kartu.",
  ],
  [
    "Bisakah meminta tanpa pewangi atau penanganan terpisah?",
    "Tuliskan kebutuhan tersebut pada kolom catatan. Outlet akan mengonfirmasi apakah permintaan dapat dipenuhi. Kebijakan pemisahan pakaian belum dipublikasikan, jadi tanyakan sebelum menyerahkan cucian.",
  ],
];

export function LandingPage() {
  const { user } = useAuth();
  const laundry = usePublicLaundry();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const messageLink = whatsAppLink(
    laundry.phone,
    `Halo ${laundry.name}, saya ingin menanyakan layanan laundry.`,
  );
  const instagram = /^https:\/\/(www\.)?instagram\.com\//.test(
    laundrySite.instagram,
  )
    ? laundrySite.instagram
    : "";

  usePageMeta({
    title: `${laundry.name} | Laundry Kiloan, Setrika & Express`,
    description: `Kenali layanan ${laundry.name}, lihat harga acuan laundry kiloan dan express, lalu siapkan pesanan langsung melalui website. Jadwal dan harga akhir dikonfirmasi lewat WhatsApp.`,
    path: "/",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        !navRef.current?.contains(event.target as Node) &&
        !menuButton.current?.contains(event.target as Node)
      )
        setMenuOpen(false);
    };
    const media = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (
      !rootRef.current ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    rootRef.current.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("will-reveal");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  function selectService(id: string) {
    setSelectedServiceId(id);
    document.getElementById("pesan")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    window.setTimeout(
      () =>
        document
          .getElementById("order-service")
          ?.focus({ preventScroll: true }),
      100,
    );
  }

  return (
    <div className="laundry-page" ref={rootRef}>
      <a className="laundry-skip-link" href="#konten">
        Lewati ke konten utama
      </a>
      <header className={`laundry-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="laundry-container laundry-header-inner">
          <a
            className="laundry-wordmark"
            href="#home"
            aria-label={`${laundry.name}, kembali ke beranda`}
          >
            <LaundryWordmark name={laundry.name} />
          </a>
          <nav
            id="laundry-navigation"
            ref={navRef}
            className={`laundry-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Navigasi utama"
          >
            {navigation.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <Link
              className="laundry-mobile-staff"
              to={user ? "/home" : "/login"}
            >
              {user ? "Dashboard outlet" : "Masuk pengelola"}
            </Link>
            <a
              className="laundry-button laundry-mobile-order"
              href="#pesan"
              onClick={() => setMenuOpen(false)}
            >
              Pesan Sekarang
            </a>
          </nav>
          <div className="laundry-header-actions">
            <a className="laundry-button laundry-header-cta" href="#pesan">
              Pesan Sekarang
            </a>
            <button
              ref={menuButton}
              type="button"
              className="laundry-menu-toggle"
              aria-label={
                menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-expanded={menuOpen}
              aria-controls="laundry-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="konten">
        <section id="home" className="laundry-hero laundry-container">
          <div className="laundry-hero-copy">
            <p className="laundry-eyebrow">
              <span />
              Waktu Anda untuk hal yang lebih berarti
            </p>
            <h1>
              Laundry bersih,
              <br />
              <span>wangi,</span>
              <br />
              tanpa ribet.
            </h1>
            <p className="laundry-hero-description">
              Dari pakaian sehari-hari sampai kemeja favorit. Pilih
              perawatannya, kirim detail pesanan, lalu biarkan hari Anda tetap
              berjalan.
            </p>
            <div className="laundry-hero-actions">
              <a className="laundry-button" href="#pesan">
                Pesan Laundry Sekarang
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a
                className="laundry-button laundry-button-secondary"
                href="#layanan"
              >
                Lihat Layanan
              </a>
            </div>
            <div className="laundry-hero-note">
              <MessageCircle size={17} aria-hidden="true" />
              <span>Pesan di website. Konfirmasi bersama di WhatsApp.</span>
            </div>
          </div>
          <div className="laundry-hero-visual">
            <div className="laundry-hero-image-wrap">
              <img
                className="laundry-hero-image"
                src="/images/laundry-editorial.webp"
                alt="Ilustrasi editorial keranjang berisi handuk dan kemeja bersih yang terlipat rapi"
                width="1024"
                height="1024"
                {...{ fetchpriority: "high" }}
              />
              <span className="laundry-image-caption">
                Pakaian terawat. Hari terasa lebih ringan.
              </span>
            </div>
            <div className="laundry-visual-caption">
              <Shirt size={28} aria-hidden="true" />
              <div>
                <strong>Untuk yang Anda pakai setiap hari.</strong>
                <span>Kiloan, satuan, dan setrika.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="laundry-benefit-strip">
          <div className="laundry-container">
            <span>
              <ClipboardList aria-hidden="true" />
              Rincian biaya sebelum konfirmasi
            </span>
            <span>
              <Clock3 aria-hidden="true" />
              Pilihan reguler & express
            </span>
            <span>
              <MessageCircle aria-hidden="true" />
              Konsultasikan perawatan pakaian
            </span>
          </div>
        </div>

        <section
          id="layanan"
          className="laundry-section laundry-container"
          data-reveal
        >
          <div className="laundry-section-heading">
            <div>
              <p className="laundry-eyebrow">Layanan laundry</p>
              <h2>
                Beda kebutuhan.
                <br />
                Tepat perawatannya.
              </h2>
            </div>
            <p>
              Untuk tumpukan pakaian harian, jadwal yang padat, atau pakaian
              yang tinggal disetrika. Pilih layanan yang sesuai.
            </p>
          </div>
          {laundry.isLoading && (
            <div className="laundry-loading" role="status">
              Sedang memuat layanan outlet...
            </div>
          )}
          {laundry.isError && (
            <div className="laundry-error" role="alert">
              <h3>Layanan belum dapat dimuat</h3>
              <p>Coba lagi atau tanyakan katalog langsung ke outlet.</p>
              <button
                className="laundry-button"
                onClick={() => laundry.refetch()}
                type="button"
              >
                Muat Ulang Layanan
              </button>
            </div>
          )}
          {!laundry.isLoading &&
            !laundry.isError &&
            laundry.services.length === 0 && (
              <div className="laundry-empty">
                <h3>Belum ada layanan yang dipublikasikan</h3>
                <p>Tanyakan kebutuhan laundry Anda melalui WhatsApp.</p>
                <a
                  href={messageLink}
                  className="laundry-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya Layanan
                </a>
              </div>
            )}
          <div className="laundry-services-grid">
            {laundry.services.map((service, index) => {
              const Icon =
                service.category === "ironing"
                  ? Shirt
                  : service.duration_value <= 1 &&
                      service.duration_unit === "days"
                    ? Clock3
                    : WashingMachine;
              const price = service.supports_kilo
                ? service.kilo_price
                : service.unit_price;
              return (
                <article
                  className={`laundry-service-card service-${index % 3}`}
                  key={service.id}
                >
                  <div className="laundry-service-top">
                    <span className="laundry-service-index">0{index + 1}</span>
                    <Icon size={34} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <p className="laundry-service-category">
                    {service.category === "ironing"
                      ? "Rapikan pakaian"
                      : service.duration_value <= 1 &&
                          service.duration_unit === "days"
                        ? "Untuk jadwal padat"
                        : "Perawatan harian"}
                  </p>
                  <h3>{service.name}</h3>
                  <p className="laundry-service-description">
                    {service.description ||
                      "Konsultasikan detail perawatan pakaian Anda dengan outlet."}
                  </p>
                  <div className="laundry-service-bottom">
                    <span>
                      <Clock3 size={15} aria-hidden="true" />
                      {serviceDuration(service)}
                    </span>
                    <strong>
                      {price == null ? "Tanya harga" : formatRupiah(price)}
                      {price != null && (
                        <small>
                          {" "}
                          / {service.supports_kilo ? "kg" : "item"}
                        </small>
                      )}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="laundry-service-link"
                    onClick={() => selectService(service.id)}
                  >
                    Pilih Layanan
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
          {laundry.usingReference && (
            <p className="laundry-catalog-note">
              Katalog dan harga acuan dari layanan awal. Ketersediaan serta
              harga {laundry.name} dikonfirmasi oleh outlet.
            </p>
          )}
        </section>

        <section id="harga" className="laundry-pricing-section" data-reveal>
          <div className="laundry-container laundry-pricing-layout">
            <div className="laundry-pricing-intro">
              <p className="laundry-eyebrow">Harga yang mudah dibaca</p>
              <h2>
                Hitung dulu.
                <br />
                Pesan kemudian.
              </h2>
              <p>
                Lihat biaya per kilogram atau per item. Anda juga bisa
                menghitung perkiraan total pada form pesanan.
              </p>
              <a className="laundry-text-link" href="#pesan">
                Hitung estimasi pesanan
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="laundry-price-panel">
              <div className="laundry-price-panel-title">
                <strong>
                  {laundry.usingReference
                    ? "Daftar harga acuan"
                    : "Daftar harga outlet"}
                </strong>
                <span>IDR / Rupiah</span>
              </div>
              {laundry.services.length ? (
                <div className="laundry-table-scroll">
                  <table className="laundry-price-table">
                    <caption className="sr-only">
                      Harga layanan laundry per kilogram dan per item
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Layanan</th>
                        <th scope="col">Per kg</th>
                        <th scope="col">Per item</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laundry.services.map((service) => (
                        <tr key={service.id}>
                          <th scope="row">
                            {service.name}
                            <span>{serviceDuration(service)}</span>
                          </th>
                          <td>
                            {service.supports_kilo && service.kilo_price != null
                              ? formatRupiah(service.kilo_price)
                              : "Tidak tersedia"}
                          </td>
                          <td>
                            {service.supports_unit && service.unit_price != null
                              ? formatRupiah(service.unit_price)
                              : "Tidak tersedia"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="laundry-price-note">
                  {laundry.isLoading
                    ? "Memuat daftar harga..."
                    : "Daftar harga belum tersedia. Hubungi outlet untuk konfirmasi."}
                </p>
              )}
              <p className="laundry-price-note">
                {laundry.usingReference
                  ? "Harga acuan dari katalog awal, belum terverifikasi sebagai harga outlet. "
                  : ""}
                Total akhir berdasarkan hasil timbang atau pemeriksaan barang.
                Biaya tambahan harus dikonfirmasi terlebih dahulu.
              </p>
            </div>
          </div>
        </section>

        <section
          id="cara-kerja"
          className="laundry-section laundry-container"
          data-reveal
        >
          <div className="laundry-section-heading">
            <div>
              <p className="laundry-eyebrow">Cara kerja</p>
              <h2>
                Dari keranjang,
                <br />
                kembali siap dipakai.
              </h2>
            </div>
            <p>
              Empat langkah yang jelas. Mulai dari website dan sepakati
              detailnya bersama outlet.
            </p>
          </div>
          <ol className="laundry-process">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <div className="laundry-process-marker">
                  <span>0{index + 1}</span>
                  <step.icon size={23} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="tentang"
          className="laundry-container laundry-about"
          data-reveal
        >
          <div className="laundry-about-copy">
            <p className="laundry-eyebrow">Tentang {laundry.name}</p>
            <h2>
              Lebih sedikit
              <br />
              urusan cucian.
              <br />
              <span>
                Lebih banyak
                <br />
                waktu untuk Anda.
              </span>
            </h2>
            <p>
              {laundry.description ||
                `${laundry.name} menghadirkan cara yang sederhana untuk merencanakan perawatan pakaian. Kenali pilihan layanan, periksa perkiraan biayanya, dan bicarakan kebutuhan Anda langsung dengan outlet.`}
            </p>
            <a className="laundry-button laundry-button-white" href="#pesan">
              Rencanakan Laundry Anda
            </a>
          </div>
          <div className="laundry-about-details">
            <p className="laundry-step-label">Kenapa mulai di sini?</p>
            <article>
              <ClipboardList aria-hidden="true" />
              <div>
                <h3>Harga & detail terlihat</h3>
                <p>
                  Layanan, satuan harga, dan estimasi pengerjaan ditampilkan
                  sebelum Anda mengirim permintaan.
                </p>
              </div>
            </article>
            <article>
              <MessageCircle aria-hidden="true" />
              <div>
                <h3>Kebutuhan Anda tersampaikan</h3>
                <p>
                  Tambahkan catatan untuk pakaian khusus, pewangi, atau
                  penanganan yang perlu dibicarakan.
                </p>
              </div>
            </article>
            <article>
              <Check aria-hidden="true" />
              <div>
                <h3>Konfirmasi sebelum diproses</h3>
                <p>
                  Sepakati jadwal dan biaya bersama outlet. Tidak ada pembayaran
                  otomatis dari form.
                </p>
              </div>
            </article>
            <div className="laundry-pickup-note">
              <Truck aria-hidden="true" />
              <div>
                <h3>Ingin antar jemput?</h3>
                <p>
                  Ajukan melalui form. Outlet akan mengonfirmasi area, jadwal,
                  dan biaya jika layanan tersedia.
                </p>
                <a href="#pesan">
                  Ajukan di form pesanan
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pesan"
          className="laundry-section laundry-container laundry-order-section"
          data-reveal
        >
          <div className="laundry-order-intro">
            <p className="laundry-eyebrow">Pesan laundry online</p>
            <h2>
              Keranjang penuh?
              <br />
              <span>Kita mulai.</span>
            </h2>
            <p>
              Tak perlu menebak biayanya. Pilih layanan dan perkiraan jumlah,
              lalu periksa rincian sebelum dikirim.
            </p>
            <div className="laundry-order-tip">
              <Shirt size={35} strokeWidth={1.5} aria-hidden="true" />
              <h3>Ada pakaian yang perlu perhatian khusus?</h3>
              <p>
                Cantumkan jenis bahan dan instruksi perawatan di catatan.
                Pastikan penanganannya dikonfirmasi terlebih dahulu.
              </p>
            </div>
            <p className="laundry-order-help">
              Butuh bantuan memilih layanan?
              <br />
              <a href={messageLink} target="_blank" rel="noopener noreferrer">
                Tanya melalui WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </p>
          </div>
          <OrderRequestForm
            services={laundry.services}
            selectedServiceId={selectedServiceId}
            onServiceChange={setSelectedServiceId}
            brand={laundry.name}
            phone={laundry.phone}
            usingReference={laundry.usingReference}
          />
        </section>

        <section id="testimoni" className="laundry-review-section" data-reveal>
          <div className="laundry-container laundry-review-inner">
            <div>
              <p className="laundry-eyebrow">Cerita pelanggan</p>
              <h2>
                Kepercayaan tumbuh
                <br />
                dari pengalaman nyata.
              </h2>
            </div>
            <div className="laundry-review-empty">
              <MessageCircle size={29} aria-hidden="true" />
              <h3>Ruang untuk cerita Anda.</h3>
              <p>
                Ulasan pelanggan terverifikasi belum tersedia. Kami akan
                menampilkan pengalaman nyata ketika ulasan sudah dikumpulkan.
              </p>
              <a
                className="laundry-text-link"
                href={whatsAppLink(
                  laundry.phone,
                  `Halo ${laundry.name}, saya ingin menyampaikan pengalaman laundry saya.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Bagikan pengalaman di WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="laundry-section laundry-container laundry-faq-layout"
          data-reveal
        >
          <div>
            <p className="laundry-eyebrow">Sebelum Anda memesan</p>
            <h2>
              Masih ada
              <br />
              yang ingin ditanyakan?
            </h2>
            <p className="laundry-faq-intro">
              Detail kecil membuat semuanya lebih jelas. Ini yang perlu Anda
              ketahui sebelum menyerahkan cucian.
            </p>
          </div>
          <div className="laundry-faq-list">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={19} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="kontak"
          className="laundry-container laundry-contact-section"
          data-reveal
        >
          <div>
            <p className="laundry-eyebrow">Mari bicara</p>
            <h2>
              Cucian Anda,
              <br />
              kami bantu rencanakan.
            </h2>
            <p>
              Diskusikan layanan, jadwal, dan kebutuhan pakaian Anda langsung
              melalui WhatsApp.
            </p>
            <a
              className="laundry-button"
              href={messageLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Hubungi {laundry.name}
            </a>
          </div>
          <div className="laundry-contact-details">
            <div>
              <MessageCircle aria-hidden="true" />
              <span>
                WhatsApp<strong>{laundry.phone}</strong>
              </span>
            </div>
            <div>
              <MapPin aria-hidden="true" />
              <span>
                Alamat outlet
                <strong>
                  {laundry.address || "Alamat belum dipublikasikan"}
                </strong>
                {laundry.address ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(laundry.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat di Google Maps
                  </a>
                ) : (
                  <small>Konfirmasikan lokasi sebelum mengantar pakaian.</small>
                )}
              </span>
            </div>
            <div>
              <Clock3 aria-hidden="true" />
              <span>
                Jam operasional
                <strong>
                  {laundrySite.hours || "Jam operasional belum dipublikasikan"}
                </strong>
              </span>
            </div>
            {laundry.email && (
              <div>
                <Mail aria-hidden="true" />
                <span>
                  Email<a href={`mailto:${laundry.email}`}>{laundry.email}</a>
                </span>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="laundry-footer">
        <div className="laundry-container">
          <div className="laundry-footer-main">
            <div>
              <a className="laundry-wordmark" href="#home">
                <LaundryWordmark name={laundry.name} />
              </a>
              <p>
                Perawatan pakaian, dimulai
                <br />
                dengan percakapan yang jelas.
              </p>
            </div>
            <nav aria-label="Navigasi footer">
              <a href="#layanan">Layanan</a>
              <a href="#harga">Daftar harga</a>
              <a href="#pesan">Pesan laundry</a>
              <a href="#faq">FAQ</a>
            </nav>
            <div className="laundry-footer-contact">
              <a href={messageLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              <Link to={user ? "/home" : "/login"}>
                {user ? "Dashboard outlet" : "Masuk pengelola"}
              </Link>
            </div>
          </div>
          <div className="laundry-footer-bottom">
            <span>
              © {new Date().getFullYear()} {laundry.name}.
            </span>
            <span>Untuk pakaian Anda. Untuk waktu Anda.</span>
            <a href="#home">Kembali ke atas ↑</a>
          </div>
        </div>
      </footer>
      <a
        className="laundry-floating-whatsapp"
        href={messageLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Hubungi ${laundry.name} di WhatsApp`}
      >
        <MessageCircle aria-hidden="true" />
        <span>Tanya laundry</span>
      </a>
    </div>
  );
}
