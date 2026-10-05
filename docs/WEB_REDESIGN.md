# Laundry Mr Andy: redesign website

Tanggal pekerjaan: 4–5 Oktober 2026. Project yang ada dimodifikasi langsung.
Mode antislop: During, dipilih oleh pemilik di percakapan.

## Analisis struktur sebelum perubahan

- Frontend: React 18, TypeScript, Vite 5, Tailwind CSS, shadcn/ui, React Router.
- Backend/database: Supabase PostgreSQL dan RPC yang sudah ada. Tidak ada migrasi atau perubahan data live.
- Authentication: custom authService dan AuthContext, sesi localStorage, role pemilik/kasir; Google OAuth berbasis browser tetap ada.
- Multi-outlet: StoreContext, pemilihan outlet, filter store_id, ProtectedRoute, OwnerRoute.
- Order: POS pengelola dengan services, customers, orders, order_items, status pengerjaan dan status pembayaran.
- Pembayaran: pencatatan tunai, QRIS, transfer, DP, diskon, serta poin mengikuti kode operasional lama.
- Struk: route publik /receipt/:orderId, cetak browser, PDF, dan printer BLE. QR pembayaran public/qrcode.png dipertahankan.
- Messaging: api/whatsapp-send.js, api/wa-sender-register.js, template, dan hooks notifikasi dipertahankan.
- Offline: Dexie/IndexedDB serta queue dan engine sinkronisasi pesanan dipertahankan.
- Halaman publik lama mempromosikan software kasir, dengan instalasi browser dan unduhan APK. Belum ada endpoint publik untuk checkout pelanggan.

## Hasil implementasi

- Halaman publik menjadi website layanan Laundry Mr Andy. Website tetap dapat dikunjungi ketika pengelola sudah login.
- Hero, navigasi sticky/mobile, layanan, harga, alur pemesanan, informasi usaha, form, ulasan, FAQ, kontak, footer, dan floating WhatsApp diganti.
- Login, shell pengelola, dan dashboard utama menggunakan layout baru; route dan logic operasional lainnya dipertahankan.
- Komponen instalasi, route instalasi, welcome native, handler hardware back, splash/status bar native, integrasi Thermer, konfigurasi native, workflow APK, manifest, script pemasangan, dan aset promosi yang tidak dipakai dihapus.
- Seluruh dependency Capacitor dan Capgo dihapus. Cetak BLE memakai adapter Web Bluetooth di src/lib/webBluetooth.ts, dengan packet size browser lama 128 byte.
- Lockfile npm diperbarui. Lockfile Bun yang tidak lagi selaras dihapus; npm tetap menjadi package manager yang didokumentasikan.
- Route operasional dimuat secara lazy agar halaman pelanggan tidak memuat seluruh halaman kasir sekaligus.
- Worker produksi menyimpan resource statis; tidak menyimpan respons API/struk. Worker lama dibersihkan saat aktivasi. Development tidak memakai worker.
- Metadata Indonesia, title/description, Open Graph, Twitter card, WebSite schema, sitemap, robots, dan llms.txt disesuaikan. Domain mengikuti domain yang sudah ada.
- Import tipe Database yang file sumbernya kosong dihapus tanpa mengubah koneksi runtime. Respons gagal sender registration kini mempunyai field wajib yang sesuai dengan tipenya.

## Sumber data dan batas operasional

Nama Laundry Mr Andy dan nomor WhatsApp +62 821-3194-417 berasal dari pemilik.
Pada 5 Oktober 2026, pemilik mengganti nomor sementara awal dengan nomor tersebut
dan menyatakan nomor aktif di WhatsApp. Semua tautan default menggunakan
https://wa.me/628213194417; keterangan nomor sementara tidak lagi tampil.
Pengujian tidak mengirim pesan WhatsApp.

Harga default tetap memakai DEFAULT_SERVICES yang sudah ada: regular Rp6.000/kg
atau Rp18.000/item, express Rp8.000/kg atau Rp25.000/item, setrika Rp3.000/kg atau
Rp5.000/item. UI menyebutnya harga acuan, bukan harga outlet yang telah dikonfirmasi.
Saat VITE_PUBLIC_STORE_ID diisi, query hanya membaca field publik dan layanan aktif
outlet tersebut. Error atau katalog kosong tidak diganti diam-diam dengan harga contoh.

Form menyiapkan permintaan WhatsApp dengan nama, nomor, layanan, kg/item, tanggal,
alamat, pengantaran, catatan, dan estimasi. Rincian belum merupakan order yang diterima
atau transaksi POS. Kasir tetap mencatat transaksi dengan sistem backend yang ada
setelah outlet mengonfirmasi. Tidak ada endpoint checkout publik baru atau pembayaran
automatis. Pengiriman tetap memerlukan nomor WhatsApp aktif.

Antar jemput hanya permintaan yang memerlukan konfirmasi area, biaya, dan jadwal.
Tidak ada janji gratis antar jemput. Alamat, jam operasional, review, statistik bisnis,
sosial media, dan kebijakan penanganan yang belum tersedia tidak dibuat sebagai fakta.

Pengujian authenticated/dashboard dan katalog outlet memakai respons Supabase simulasi.
Hal ini memverifikasi rendering, scoping query, dan navigasi, bukan konektivitas backend
live atau kebenaran data bisnis. Printer fisik dan pengiriman WhatsApp live belum diuji.
Cetak browser/PDF tetap tersedia ketika Web Bluetooth tidak didukung.

## Design Read dan alasan desain

Reading this as: website layanan laundry untuk pelanggan Indonesia, dengan visual putih,
biru, ramah, dan profesional; ENERGY 2 / RHYTHM 3 / MOTION 2, mengikuti brief pemilik.

- Warna: navy membuat teks kuat, biru menandai tindakan, mint memberi satu aksen kesegaran; putih menjaga fokus pada layanan.
- Tema terang: diminta pemilik untuk kesan pakaian bersih; tidak menambahkan toggle tema yang tidak diperlukan brief.
- Tipografi: Manrope memberi headline yang tegas namun ramah; DM Sans dipilih untuk detail harga/form yang mudah dibaca.
- Hierarki: satu headline besar di hero, lalu tiap section memiliki satu judul utama yang jelas.
- Motif: headline berbaris pendek seperti lipatan, dengan biru/mint digunakan konsisten pada ide perawatan dan waktu pelanggan.
- Layout: hero split, katalog yang bisa dibandingkan, tabel harga, urutan proses, panel usaha, form dua kolom, FAQ, dan footer ringkas mengubah ritme sesuai kebutuhan konten.
- Cards layanan: ukurannya konsisten agar tiga layanan aktual mudah dibandingkan; jumlah mengikuti source, bukan jumlah kolom template.
- Harga tabel: kg dan item berada pada kolom yang sama sehingga customer dapat membandingkan tanpa tiga paket fiktif.
- Spacing: jarak section memisahkan tahap mengenal layanan, menghitung harga, dan menyiapkan permintaan.
- Radius: sudut besar pada visual/panel, lebih kecil pada button, dan kecil pada input membedakan fungsi.
- Shadow: hanya caption hero, form, header saat scroll, dan floating contact diberi elevasi sesuai posisi/fungsi; tidak membuat semua cards melayang.
- Mint underline: menekankan kata wangi dari brief pemilik; bukan gradient dekoratif atau glow halaman.
- Icons: WashingMachine untuk cuci, Shirt untuk pakaian/setrika, Clock untuk waktu, Truck untuk permintaan pengantaran, MessageCircle untuk percakapan, ClipboardList untuk detail order. Library yang sudah terpasang digunakan berdasarkan arti glyph.
- Arrows: hanya tindakan lanjutan dan link keluar yang memerlukannya; bukan ornament pada seluruh tombol.
- Animasi: reveal 16 px memisahkan section ketika discroll, hover menandai elemen interaktif; tanpa bounce, parallax, atau floating terus menerus.
- Reduced motion: reveal dan transisi dinonaktifkan sesuai preferensi sistem; konten tetap tampil tanpa IntersectionObserver.
- Gambar: editorial pakaian terlipat menjelaskan layanan, bukan foto outlet yang direkayasa.

## Visual dan lisensi

Hero dibuat memakai built-in image_gen melalui skill imagegen. Hasil dioptimalkan menjadi
public/images/laundry-editorial.webp (sekitar 102 KB) dan gambar sosial JPEG di
public/images/laundry-social.jpg. Gambar merupakan visual editorial konseptual,
bukan foto lokasi Laundry Mr Andy atau testimoni pelanggan.

Prompt final:

> Use case: product-mockup. Asset type: editorial hero visual for a modern Indonesian laundry service website. Primary request: photorealistic still life of freshly washed carefully folded white and soft sky blue cotton towels and shirts in a natural wicker laundry basket on a pale blue studio surface. A single neatly folded white shirt drapes gently over the basket edge, a simple white clothes hanger beside it. Clean, fresh, approachable premium laundry mood, no people. Soft natural daylight from the left, beautiful cotton and wicker textures, crisp but gentle shadows, uncluttered soft icy blue backdrop. Square composition centered with generous breathing room, subjects in lower two thirds. Palette white, pale sky blue, warm natural wicker. No text, no logo, no watermark, no stars, no bubbles, no extra decorative objects. This is conceptual editorial imagery, not a real business location.

Font dihost lokal dalam format WOFF2, tidak bergantung pada request Google Fonts saat
website dibuka. Lisensi SIL Open Font License disertakan di public/fonts/DM-Sans-OFL.txt
dan public/fonts/Manrope-OFL.txt. Wordmark hanya memakai nama yang diberikan pemilik.

## Bukti pengujian

- Build produksi: npm run build, termasuk prerender login.
- TypeScript: npx tsc --noEmit -p tsconfig.app.json.
- Unit tests: npm test, 26 tes untuk WhatsApp, registrasi sender, data helper, harga, validasi nomor, tanggal lokal, dan pesan permintaan.
- ESLint terarah: halaman publik, dashboard, login, components/laundry, usePublicLaundry, laundrySite, dan webBluetooth.
- Browser: Playwright dengan browser Brave/Chromium lokal. Semua external WhatsApp diintersep sehingga tidak mengirim pesan.
- Responsive: 320, 375, 390, 768, 1024, 1440 px, tanpa horizontal overflow atau gambar gagal.
- Katalog: loading, data outlet, kosong, 503/error, dan retry pulih diuji dengan backend simulasi.
- Aksesibilitas: Axe WCAG 2 A/AA dan 2.1 A/AA pada halaman publik desktop, halaman publik mobile dengan katalog simulasi, dan login mobile, tanpa pelanggaran.
- Browser exceptions dan console errors: tidak ditemukan pada alur publik yang diuji. Dashboard simulasi tanpa browser exception.
- Preview build produksi: homepage dan login lazy berhasil dimuat. Worker aktif tanpa manifest instalasi; cache hanya berisi resource publik. Navigasi struk yang belum dimuat saat offline menampilkan fallback, lalu tombol reconnect kembali ke website setelah internet tersedia.
- Hasil pengujian browser disimpan di docs/verification/public.json, catalog-dashboard.json, dan production.json.

### Pembaruan kontak, 5 Oktober 2026

- Kontak default diganti ke +62 821-3194-417 sesuai instruksi pemilik, dengan tujuan tautan /628213194417.
- Keterangan nomor sementara tidak lagi tampil pada kontak, ringkasan, atau label tombol WhatsApp.
- Enam tes laundrySite lulus, termasuk normalisasi nomor baru dan encoding pesan.
- Pemeriksaan browser memvalidasi semua tautan WhatsApp dan ringkasan form tanpa mengirim pesan. Bukti: docs/verification/contact-update.json.
- Delivery Gate untuk perubahan kontak PASS: nomor berasal dari pemilik (R-23/R-36), tautan menuju target yang sama (R-24/R-26), dan keterangan status sesuai informasi pemilik (R-38/C-5). Arah visual dan layout mengikuti hasil redesign yang telah diuji.

### Catatan klik per elemen pada pengujian redesign awal

Pengujian awal berikut memakai nomor sementara sebelum diperbarui oleh pemilik.

- Header wordmark, semua menu section, hero CTA, secondary CTA, tautan estimasi, permintaan pickup, about CTA, footer section links, dan kembali ke atas: membuka target yang ada.
- Skip link: Tab menampilkan link, Enter menuju main.
- Menu mobile: tombol membuka; Escape menutup dan mengembalikan fokus; klik section menutup.
- Ketiga Pilih Layanan: memilih layanan terkait pada form dan memindahkan fokus.
- Dropdown layanan: harga dan durasi mengikuti pilihan.
- Dropdown kg/item: mengganti harga satuan dan aturan jumlah; 2,5 kg regular = Rp15.000; 2 item = Rp36.000.
- Jumlah fractional item: invalid; jumlah fractional kg: valid.
- Empty form: tidak menghasilkan ringkasan. Pickup tanpa alamat: tidak menghasilkan ringkasan.
- Form lengkap: rincian tampil, dengan status permintaan dan penjelasan nomor sementara.
- Salin rincian: clipboard berhasil, feedback tampil.
- Buka WhatsApp: URL memakai /6281234567 dan pesan terenkode, termasuk ampersand/catatan; tidak dikirim di pengujian.
- Perubahan input setelah rincian tampil: membuang rincian yang sudah tidak sesuai.
- Enam FAQ: masing-masing dapat dibuka dan ditutup.
- WhatsApp floating, bantuan, feedback ulasan, kontak, dan footer: menuju kontak konfigurasi.
- Link pengelola: membuka login. Tabs login/signup dan visibility password bekerja. Link kembali menuju website.
- Semua sembilan route operasional: tetap memerlukan autentikasi.
- Route instalasi yang dihapus: 404 dengan link kembali yang bekerja.
- Dashboard simulasi: responsive 320/390/768/1440; tombol pesanan, seluruh delapan shortcut aktivitas, baris pesanan terbaru, riwayat, dan link website menuju route yang sesuai.

## Delivery Gate antislop

Laporan berikut berlaku untuk UI yang diubah dan konfigurasi yang disertakan.
Batas pengujian backend live/printer fisik dijelaskan di atas dan tidak dianggap sebagai tes hardware yang lulus.

### Hard Gate

- R-02 PASS: tidak ada em dash pada copy UI baru; scan source halaman/form bersih.
- R-03 PASS: enam breakpoint halaman publik dan empat breakpoint dashboard diuji tanpa overflow.
- R-17 PASS: tidak ada statistik bisnis yang dibuat; metrik pengelola berasal dari hook database lama.
- R-18 PASS: review berisi kondisi kosong terverifikasi, tanpa nama/avatar/rating palsu.
- R-23 PASS: brand/kontak dari pemilik; navigasi dan visual mengikuti brief eksplisit; gambar tidak mewakili lokasi bisnis.
- R-24 PASS: seluruh anchor publik dan route pengelola mempunyai target; route instalasi tidak ada di navigasi.
- R-25 PASS: Axe A/AA tanpa pelanggaran pada desktop, mobile, dan login; warna muted dibuat cukup gelap.
- R-26 PASS: CTA, menu, dropdown, copy, form, FAQ, kontak, dan tautan mempunyai perilaku yang tercatat di daftar klik.
- R-27 PASS: katalog mempunyai loading, empty, error, retry; form mempunyai validasi dan feedback; ulasan/kontak yang kosong dijelaskan.
- R-28 PASS: FAQ menjawab alur WhatsApp, harga kg/item, jadwal, penanganan, metode pembayaran, dan permintaan pickup secara spesifik.
- R-32 PASS: skip, menu/Escape, fokus input, button, dan native details dapat dioperasikan keyboard; focus-visible tersedia.
- R-33 PASS: fitur ditulis langsung sebagai TSX/CSS; tidak memakai script pengganti string untuk implementasi UI. Prettier hanya memformat.
- R-34 PASS: hanya tema terang yang diminta pemilik; tidak ada toggle dengan mode yang belum selesai.
- R-35 PASS: build, tes, typecheck, lint terarah, browser runtime, dan daftar klik dicatat; backend simulasi dibedakan dari backend live.
- R-36 PASS: tidak ada klaim keamanan, uptime, peningkatan kinerja, statistik, atau testimoni tanpa sumber.
- R-37 PASS: brief pemilik menjadi arah; Design Read dan dials dinyatakan sebelum implementasi.
- R-38 PASS: harga acuan berlabel; kontak aktif diberikan pemilik; informasi outlet/review yang belum tersedia memakai kondisi kosong.

### Purpose Gate

- R-01 PASS: biru memberi hierarki tindakan, navy untuk teks, mint sebagai aksen brief; tidak ada glow/orb/rainbow gradient.
- R-04 PASS: ikon dipilih menurut layanan/tindakan yang dijelaskan pada alasan desain, bukan glyph sparkle atau simbol generik.
- R-06 PASS: Manrope/DM Sans dipilih untuk karakter ramah dan keterbacaan; tidak ada monospace/uppercase tracking dekoratif.
- R-07 PASS: background polos; tidak ada dot grid atau blueprint tanpa fungsi.
- R-08 PASS: arrows menunjukkan tindakan lanjutan/keluar, disertai alasan; banyak tombol fungsional tetap tanpa arrow.
- R-09 PASS: tidak ada pill di atas H1, badge promosi, atau klaim status tanpa data.
- R-10 PASS: tidak ada glassmorphism bertumpuk; header putih ringan.
- R-12 PASS: elevasi dibatasi pada caption/form/header/floating contact sesuai fungsi yang dicatat.
- R-13 PASS: tidak ada glow pada cards, button, border, atau background.
- R-14 PASS: cards katalog seragam untuk perbandingan layanan aktual; harga/proses/about/form/review/FAQ memakai struktur berbeda.
- R-19 PASS: reveal dan hover punya fungsi navigasi perhatian, sesuai MOTION 2; reduced motion menonaktifkannya.
- R-22 PASS: pakaian terlipat berhubungan langsung dengan layanan; tidak ada ilustrasi blob atau figur generik.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 3 / MOTION 2 tertulis dan diterapkan.
- Kesesuaian dials PASS: hero tegas, komposisi section berganti, reveal ringan tanpa animasi berlebihan.
- Focal point PASS: headline menjadi fokus hero; section lain memiliki judul/tindakan utama yang jelas.
- Whitespace PASS: padding section memisahkan tahap pengenalan, perbandingan, dan order.
- Accent PASS: mint hanya memberi aksen kata/ide perawatan, bukan seluruh UI.
- Identity motif PASS: headline berbaris pendek, palette biru/navy, dan visual lipatan pakaian konsisten pada konteks laundry.
- Design Read PASS: dinyatakan sebelum generasi UI dan direkam di dokumen ini.

### Craftsmanship dan Quality Locks

- C-1 PASS: warna, font, layout, spacing, ikon, gambar, radius, dan motion memiliki alasan tertulis.
- C-2 PASS: seluruh kontrol baru memiliki perilaku, termasuk feedback dan kondisi kosong.
- C-3 PASS: section mengikuti kebutuhan pemilik dan data; statistik tanpa sumber tidak ditambahkan.
- C-4 PASS: breakpoint, error/empty/loading, dan keyboard diperiksa; tema terang konsisten.
- C-5 PASS: data bisnis tidak dibuat; kontak berasal dari pemilik dan katalog acuan disebutkan dengan jujur.
- R-05 PASS: ritme hero/katalog/tabel/rail/panel/form/FAQ bervariasi; tidak ada logo bar atau tiga paket harga fiktif.
- R-11 PASS: radius visual, panel, card, button, input berbeda sesuai hierarki, bukan seluruhnya pill.
- R-15 PASS: CTA menyebut pesanan laundry, layanan, konfirmasi, salin rincian, atau kontak secara konkret.
- R-16 PASS: copy baru memakai manfaat dan instruksi spesifik, tanpa buzzword AI marketing.
- R-20 PASS: pakaian terlipat, layanan kiloan/item, bahasa Indonesia, dan form estimasi membentuk identitas laundry.
- R-21 PASS: tema putih mengikuti permintaan brand bersih; dark mode tidak dipaksakan.
- R-29 PASS: dua core hue biru/navy dan satu aksen mint; selebihnya warna netral.
- R-30 PASS: tidak mengikuti layout atau nama produk lain; struktur berangkat dari katalog dan pemesanan laundry.
- R-31 PASS: alasan tiap keputusan besar tercatat pada Design Read dan alasan desain.

## Preview

- docs/previews/desktop.png
- docs/previews/mobile.png

Kedua preview diperbarui dari browser setelah pembersihan kode pada 5 Oktober 2026, dengan kontak terbaru.

## Pembersihan package dan kode, 5 Oktober 2026

Pemeriksaan memakai TypeScript AST dan resolver module untuk menelusuri import,
re-export, dan literal dynamic import dari main serta semua entry tes. Konfigurasi
build dan endpoint API diperiksa terpisah. Audit ini memeriksa file yang tidak
terjangkau dan variabel/import tidak terpakai; bukan pembuktian bahwa setiap export
individual di seluruh library sudah minimal.

| Ukuran | Sebelum cleanup | Sesudah cleanup |
| --- | ---: | ---: |
| Dependency langsung | 61 | 38 |
| Dev dependency langsung | 21 | 18 |
| File source TS/TSX/CSS | 159 | 135 |
| File source tidak terjangkau dari app/tes | 24 | 0 |
| Ukuran node_modules lokal, kira-kira | 443 MiB | 398 MiB |

Total 26 dependency langsung dihapus; npm menghapus 89 package terinstal termasuk
dependency turunannya. Ukuran instalasi lokal mencakup compiler dan alat development,
bukan ukuran yang seluruhnya diunduh pelanggan. Daftar lengkap package/file dan
metode pemeriksaan tersedia di docs/verification/cleanup-audit.json.

- Dihapus: 19 file komponen/helper UI template, empat widget dashboard lama, hook useOrders lama, proxy Express terpisah yang tidak dirujuk script/hosting, dan generator favicon kosong. Total 26 file.
- Proxy WhatsApp yang dipakai aplikasi tetap melalui Vite saat development dan endpoint api saat deployment.
- Tagger development Lovable dan telemetri Vercel opsional dihapus. Preview lokal sebelumnya meminta dua script telemetri yang menghasilkan 404; pemeriksaan akhir tanpa error tersebut.
- Sonner mengikuti tema terang website tanpa next-themes; toast lain yang masih dipakai tetap tersedia.
- Import, variabel, helper status, dan konstanta printer yang tidak digunakan dibersihkan. Interface/callsite bisnis yang masih diperlukan dipertahankan.
- Dua query debug yang tidak menghasilkan data untuk fitur dihapus: query pengecekan awal orders dan daftar seluruh stores di helper WhatsApp. Query utama dan filter outlet dipertahankan.
- Flag, prop, dan CSS keterangan nomor sementara dihapus setelah nomor aktif diberikan pemilik.
- Rewrite hosting ke halaman install yang sudah dihapus dibersihkan.
- noUnusedLocals dan noUnusedParameters diaktifkan pada TypeScript app agar import/variabel tidak terpakai terdeteksi lagi.
- tailwindcss-animate dipertahankan karena dipakai konfigurasi Tailwind. Package lain yang tersisa digunakan oleh source atau proses build/test.
- Login, POS, pembayaran, poin, struk, printer browser/BLE, offline queue, WhatsApp bisnis, dan semua route pengelola dipertahankan. Migrasi database tidak dihapus dan data live tidak diubah.

### Verifikasi dan Delivery Gate cleanup

Laporan Delivery Gate lengkap di atas tetap menjadi acuan desain. Bukti ulang
per elemen tersedia di docs/verification/cleanup-public.json dan cleanup-dashboard.json.

- Build PASS: npm run build berhasil sesudah penghapusan seluruh dependency dan kode.
- TypeScript PASS: npx tsc --noEmit -p tsconfig.app.json berhasil dengan kedua aturan unused aktif.
- Unit tests PASS: seluruh 26 tes yang ada lulus.
- Audit module PASS: seluruh 135 file source tersambung ke app/tes/deklarasi tipe. Konfigurasi Tailwind menjelaskan satu package build yang tidak muncul di graph frontend.
- R-03 PASS: enam lebar halaman publik dan empat lebar dashboard diperiksa tanpa overflow.
- R-24/R-26 PASS: menu, anchor, pemilihan layanan, ringkasan, salin rincian, WhatsApp, FAQ, login tabs, password toggle, kembali, dan seluruh delapan shortcut dashboard diklik ke target yang sesuai.
- R-25/R-32 PASS: Axe A/AA bersih pada desktop/mobile publik; skip dan menu/Escape berfungsi dengan keyboard.
- R-27 PASS: validasi form serta katalog loading, empty, error, dan retry tetap bekerja dengan backend simulasi.
- R-33 PASS: perubahan source/CSS ditulis langsung melalui patch; script audit hanya membaca source dan menulis bukti JSON.
- R-34 PASS: toast memakai tema terang yang sama dengan website; tidak ada mode atau toggle baru.
- R-35 PASS: build dijalankan dan hasil produksi diuji di browser; tidak ada exception atau console error pada alur publik yang diperiksa. Dashboard simulasi tanpa exception.
- R-23/R-36/R-38/C-5 PASS: nomor pemilik tetap +62 821-3194-417; seluruh tautan pemesanan menuju /628213194417. Harga acuan dan batas konfirmasi tetap disebutkan; tidak ada fakta bisnis baru yang dibuat.
- Batas verifikasi: navigasi dashboard/katalog memakai Supabase simulasi. Tidak mengirim WhatsApp, membuat transaksi live, atau menguji printer fisik.
