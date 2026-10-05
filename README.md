# Laundry Mr Andy

Website layanan laundry berbasis web, dibangun dengan React 18, TypeScript, Vite,
Tailwind CSS, shadcn/ui, dan Supabase. Project POS yang sudah ada tetap digunakan.

## Menjalankan

Node.js dan npm diperlukan. Dari folder project:

```sh
npm install
npm run dev
```

Buka URL yang tercetak di terminal. Port awal adalah `http://localhost:8080`.
Jika port tersebut dipakai, Vite memilih port berikutnya.

```sh
npm run build
npm run preview
npm test
npx tsc --noEmit -p tsconfig.app.json
```

## Website pelanggan

`/` menampilkan layanan, harga, cara pemesanan, informasi usaha, kondisi kosong
ulasan, FAQ, kontak, dan form permintaan laundry. Form menghitung estimasi biaya
lalu menyiapkan pesan WhatsApp. Pelanggan tetap perlu mengirim pesan dan mendapatkan
konfirmasi outlet. Form tidak membuat transaksi POS atau pembayaran otomatis.

Nama **Laundry Mr Andy** dan nomor WhatsApp **+62 821-3194-417** berasal dari pemilik.
Pemilik menyatakan nomor tersebut aktif di WhatsApp. Tidak ada alamat, jam operasional,
ulasan, statistik, atau janji antar jemput yang dibuat sebagai fakta bisnis.

Harga awal tetap berasal dari `DEFAULT_SERVICES` di `src/hooks/useServices.ts`:

| Layanan | Per kg | Per item | Estimasi |
| --- | --- | --- | --- |
| Cuci Setrika Regular | Rp6.000 | Rp18.000 | 2 hari |
| Express Wash | Rp8.000 | Rp25.000 | 1 hari |
| Setrika Saja | Rp3.000 | Rp5.000 | 4 jam |

Harga ini diberi label **harga acuan**, sampai katalog outlet terhubung.

## Informasi outlet

Default publik ada di `src/lib/laundrySite.ts`. Nilai bisa diganti melalui `.env.local`:

```dotenv
VITE_LAUNDRY_NAME=Laundry Mr Andy
VITE_LAUNDRY_WHATSAPP=628213194417
VITE_LAUNDRY_ADDRESS=
VITE_LAUNDRY_EMAIL=
VITE_LAUNDRY_HOURS=
VITE_LAUNDRY_INSTAGRAM=
VITE_PUBLIC_STORE_ID=
VITE_SITE_URL=https://pos.fahrudina.my.id
```

Isi nomor WhatsApp jika ingin mengganti kontak pemesanan. Nilai kosong
menggunakan default atau kondisi kosong yang jelas. Isi `VITE_PUBLIC_STORE_ID` dengan
ID outlet yang memang akan dipublikasikan agar kontak, layanan aktif, dan harga dibaca
dari Supabase. Query hanya mengambil field publik outlet tersebut, bukan daftar seluruh
toko. Jangan gunakan service-role key di browser. Tidak ada perubahan database/migrasi
atau izin akses yang diterapkan oleh redesign.

Domain di metadata statis `index.html`, sitemap, dan script prerender mengikuti domain
lama. Sesuaikan jika domain deployment berubah.

## Dashboard pengelola

Login dan pendaftaran pemilik/kasir tetap tersedia di `/login`. Login Google berbasis
browser muncul jika `VITE_GOOGLE_CLIENT_ID` dikonfigurasi. Route operasional tetap:

- `/home`: dashboard outlet, onboarding, metrik dari database, dan aktivitas cepat.
- `/pos`: pencatatan order serta pembayaran.
- `/order-history`: status order, pembayaran, dan struk.
- `/customers`: data pelanggan dan poin.
- `/services`, `/stores`: pengelolaan oleh pemilik.
- `/expenses`, `/revenue-report`: pengeluaran dan laporan.
- `/whatsapp-broadcast`: komunikasi pelanggan.
- `/receipt/:orderId`: struk publik dari fungsi backend yang sudah ada.

Integrasi WhatsApp operasional tetap memakai `api/whatsapp-send.js`,
`api/wa-sender-register.js`, dan konfigurasi pada `.env.example`. Untuk proxy lokal,
set `VITE_WHATSAPP_USE_PROXY=true` dan isi `WHATSAPP_API_URL` serta kredensial server.

Cetak browser dan ekspor PDF dipertahankan. Printer BLE memakai **Web Bluetooth**
melalui HTTPS dan browser yang mendukungnya. Hardware belum diuji pada redesign ini.
Pesanan offline tetap disimpan di IndexedDB dan menggunakan engine sinkronisasi lama.
Service worker hanya aktif pada build produksi, tanpa manifest atau tombol instalasi.

## Desain dan verifikasi

Lihat `docs/WEB_REDESIGN.md` untuk alasan desain, analisis struktur, sumber visual,
bukti pengujian, dan laporan Delivery Gate antislop. Preview ada di `docs/previews/`.
