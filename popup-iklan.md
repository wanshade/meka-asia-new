# Plan Design Popup Iklan Meka Asia

## Tujuan

Membuat popup campaign untuk dua promo bulan Juli tanpa mengganggu pengalaman menjelajah website. Popup harus terasa premium, mudah ditutup, responsif, dapat diakses, dan mengarahkan pengguna ke nomor WhatsApp yang sesuai dengan masing-masing iklan.

Sumber visual:

- `public/iklan/iklan1.jpeg` - Green Tamarin, cashback Rp7 juta, WhatsApp 0819 3115 1888.
- `public/iklan/iklan2.jpeg` - Living Asia, cashback Rp100 juta, WhatsApp 0811 3900 899.

Kedua poster berukuran `720x1280` dengan rasio vertikal `9:16`. Ukuran file sekitar 101-112 KB, sehingga sudah cukup ringan. Pertahankan resolusi dan ketajaman QR code; jangan melakukan kompresi agresif yang dapat merusak kemampuan scan.

## Keputusan Utama

- Tampilkan satu popup dengan satu poster aktif, bukan dua poster berdampingan.
- Sediakan tombol previous/next atau dua dot agar pengguna dapat melihat promo lain secara manual.
- Jangan menggunakan autoplay carousel karena teks dan QR code membutuhkan waktu untuk dibaca.
- Popup selalu mulai dari iklan pertama, lalu pengguna dapat membuka iklan kedua melalui navigasi manual.
- Jangan menampilkan dua popup secara berurutan.
- Popup awal diterapkan di homepage saja. Jangan mengganggu pengguna yang sedang membaca detail artikel.
- Untuk mode demo, popup selalu ditampilkan pada setiap reload homepage tanpa frequency cap atau pengecekan riwayat pengguna.

## Campaign Mapping

```js
const campaigns = [
  {
    id: "green-tamarin-july-2026",
    project: "Green Tamarin",
    image: "/iklan/iklan1.jpeg",
    imageAlt: "Promo Green Tamarin cashback tujuh juta rupiah khusus bulan Juli",
    phone: "6281931151888",
    message: "Halo Meka Asia, saya tertarik dengan promo Green Tamarin cashback 7 juta.",
  },
  {
    id: "living-asia-july-2026",
    project: "Living Asia",
    image: "/iklan/iklan2.jpeg",
    imageAlt: "Promo Living Asia July Deal cashback seratus juta rupiah",
    phone: "628113900899",
    message: "Halo Meka Asia, saya tertarik dengan promo Living Asia July Deal cashback 100 juta.",
  },
];
```

Nomor, nilai cashback, dan pesan WhatsApp harus disimpan di data campaign, bukan tersebar di komponen.

## Mode Demo dan Trigger Muncul

Gunakan konfigurasi demo yang eksplisit:

```js
const promoConfig = {
  demoMode: true,
  initialCampaignIndex: 0,
};
```

Perilaku mode demo:

- tampilkan popup pada setiap load/reload homepage;
- mulai dari `iklan1.jpeg`;
- buka setelah poster pertama selesai dimuat dan decode;
- jangan menunggu timer enam detik atau scroll 25%;
- jangan membaca atau menulis `sessionStorage`, `localStorage`, atau cookie;
- setelah ditutup, popup tetap tertutup selama page view yang sedang berjalan;
- reload halaman menampilkan popup kembali;
- klik CTA tidak menekan kemunculan popup pada kunjungan berikutnya.

Syarat tambahan:

- jangan tampil ketika tab sedang hidden;
- jangan tampil saat modal/dialog lain sedang terbuka;
- jangan tampil saat pengguna sedang mengetik pada input atau textarea;
- reduced motion tetap menampilkan popup, tetapi tanpa scale/slide animation;
- jika halaman selesai load saat tab hidden, buka popup ketika tab kembali aktif.

## Penyimpanan State Demo

Jangan gunakan persistence untuk versi demo:

```text
sessionStorage = tidak digunakan
localStorage = tidak digunakan
cookie = tidak digunakan
```

Aturan:

- `isOpen` dan `activeCampaignIndex` cukup disimpan pada React state;
- `isOpen` mulai sebagai `false`, lalu menjadi `true` setelah poster pertama siap;
- close mengubah `isOpen` menjadi `false` untuk page view saat ini;
- reload menginisialisasi state dari awal dan menampilkan popup kembali;
- tidak ada penundaan 24 jam;
- tidak ada penundaan tujuh hari setelah CTA;
- tidak ada batas satu kali per session yang disimpan lintas reload;
- mode production dengan frequency cap dapat ditambahkan kemudian di belakang `demoMode: false`.

## Struktur Modal

```text
overlay
`-- dialog
    |-- close button
    |-- poster viewport
    |   `-- active campaign image
    |-- campaign navigation
    |   |-- previous
    |   |-- status "Promo 1 dari 2"
    |   `-- next
    `-- action footer
        `-- CTA WhatsApp
```

Gunakan elemen dialog semantik:

- `role="dialog"`;
- `aria-modal="true"`;
- `aria-label="Promo Meka Asia bulan Juli"`;
- close button memiliki `aria-label="Tutup promo"`;
- status carousel memakai `aria-live="polite"`.

## Visual Desktop

- Overlay menggunakan forest gelap transparan, misalnya `rgba(10, 28, 20, 0.78)`.
- Jangan gunakan backdrop blur besar karena dapat menambah biaya paint di atas halaman animasi.
- Modal maksimal sekitar 420-460 px lebar.
- Tinggi maksimal `88dvh`.
- Poster menggunakan `object-fit: contain` agar seluruh informasi dan QR code terlihat.
- Background dialog ivory atau putih hangat.
- Radius sekitar 16-20 px, mengikuti nuansa premium tanpa mengubah desain poster.
- Shadow lembut dan border tipis ivory transparan.
- Close button berbentuk lingkaran 40-44 px, berada di kanan atas dan tidak menutupi logo poster.
- Footer CTA berada di luar gambar agar tidak menutupi nomor telepon atau QR code.

## Visual Mobile

- Lebar modal `calc(100vw - 24px)`.
- Tinggi maksimal `92svh`.
- Poster tetap menggunakan `object-fit: contain`.
- Jangan crop bagian atas, cashback, QR code, atau nomor WhatsApp.
- Close button minimal 44x44 px dan selalu terlihat.
- CTA WhatsApp sticky di bagian bawah dialog, tetapi tidak menutupi poster.
- Jika tinggi layar sangat pendek, isi dialog dapat scroll secara internal sedangkan background tetap terkunci.
- Safe-area bawah menggunakan `env(safe-area-inset-bottom)`.

## CTA WhatsApp

Gunakan CTA yang berbeda per campaign:

- Green Tamarin: `Tanya Promo Green Tamarin`.
- Living Asia: `Tanya Promo Living Asia`.

URL dibentuk dari nomor dan pesan campaign:

```js
const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
```

CTA membuka tab baru dengan `target="_blank"` dan `rel="noopener noreferrer"`.

QR code tetap terlihat di dalam poster, tetapi CTA teks diperlukan untuk:

- pengguna mobile yang tidak dapat memindai layar sendiri;
- aksesibilitas;
- tracking klik;
- fallback jika QR code sulit dibaca.

## Navigasi Dua Iklan

- Gunakan tombol previous dan next dengan icon dari library yang sudah dipakai situs.
- Tambahkan dua dot dengan active state gold.
- Tidak ada autoplay.
- Swipe horizontal boleh ditambahkan di mobile, tetapi tombol tetap harus tersedia.
- Perubahan poster menggunakan fade singkat, bukan slide panjang.
- Saat poster berganti, update alt text, CTA, nomor tujuan, dan status `Promo X dari 2` dalam satu state update.
- Jangan membuat kedua gambar berada pada compositor layer aktif bersamaan setelah transisi selesai.

## Motion

Animasi masuk:

- overlay fade 180-220 ms;
- dialog fade + scale dari `0.98` ke `1` selama 220-280 ms;
- easing lembut, tidak menggunakan bounce.

Animasi keluar:

- fade sekitar 160-200 ms;
- setelah animasi selesai, lepaskan dialog dari DOM dan kembalikan focus.

Pergantian iklan:

- crossfade 180-240 ms;
- jangan memakai GSAP ScrollTrigger atau Lenis untuk modal;
- modal mempunyai lifecycle animasi sendiri yang sederhana.

Reduced motion:

- tidak ada scale atau slide;
- modal langsung tampil/hilang dengan opacity minimal atau tanpa animasi.

## Interaction dan Accessibility

Saat dialog dibuka:

- simpan elemen yang sedang focus;
- pindahkan focus ke close button atau heading dialog;
- lock scroll background tanpa mengubah posisi halaman;
- trap focus di dalam dialog;
- `Escape` menutup dialog;
- klik backdrop menutup dialog;
- klik di dalam dialog tidak boleh memicu backdrop close.

Saat dialog ditutup:

- pulihkan scroll background;
- kembalikan focus ke elemen sebelumnya;
- hapus seluruh listener milik dialog;
- pertahankan state tertutup sampai halaman direload.

Jangan:

- menyembunyikan tombol close beberapa detik;
- memakai countdown yang memaksa;
- membuka WhatsApp tanpa tindakan pengguna;
- memutar suara;
- menampilkan popup kembali pada page yang sama setelah ditutup;
- membuat close button kecil atau samar.

## Component Plan

Pisahkan popup dari `HomeClient.jsx` agar lifecycle lebih mudah dikelola:

```text
app/
|-- HomeClient.jsx
`-- components/
    `-- PromoPopup.jsx

lib/
`-- promoCampaigns.js
```

`PromoPopup.jsx` menangani:

- load/decode poster pertama;
- active campaign;
- open/close state;
- focus trap;
- keyboard navigation;
- CTA click.

`promoCampaigns.js` menangani:

- data dua campaign;
- nomor WhatsApp;
- pesan prefilled;
- urutan campaign demo.

Pasang `<PromoPopup />` satu kali di `HomeClient`, di luar markup string `dangerouslySetInnerHTML`, agar state React dan accessibility lebih aman.

## Image Loading dan Performa

- Jangan preload kedua poster pada initial HTML.
- Load poster yang dipilih setelah halaman interaktif dan browser idle.
- Prefetch poster kedua setelah popup terbuka.
- Gunakan width `720` dan height `1280` agar layout modal stabil.
- Gunakan `decoding="async"`.
- Pertahankan JPEG asli bila hasil konversi membuat QR code kurang tajam.
- Jika membuat WebP/AVIF, validasi QR code pada ponsel nyata sebelum mengganti sumber utama.
- Unmount gambar dan dialog setelah close agar tidak menambah layer aktif.

## Tracking Opsional

Siapkan event tanpa mengikat implementasi ke vendor analytics tertentu:

- `promo_impression` dengan campaign id;
- `promo_next` dan `promo_previous`;
- `promo_close`;
- `promo_whatsapp_click`;
- `promo_qr_visible` hanya sebagai state visual, bukan bukti QR dipindai.

Jangan menyimpan nomor telepon atau data pribadi pengguna di event analytics.

## Edge Cases

- JavaScript tidak tersedia: popup tidak dirender karena modal memerlukan state dan interaction.
- Salah satu gambar gagal dimuat: tampilkan campaign lain; jika keduanya gagal, jangan buka modal kosong.
- Orientation change: hitung ulang tinggi dialog tanpa menutup popup.
- Halaman di-background-kan sebelum gambar selesai decode: jangan membuka popup ketika tab masih hidden.

## Urutan Implementasi

1. Buat data dua campaign dalam urutan demo.
2. Buat komponen `PromoPopup` dengan satu poster dan CTA.
3. Tambahkan close, backdrop, Escape, focus trap, dan scroll lock.
4. Tambahkan `demoMode: true` dan buka popup setelah poster pertama selesai decode.
5. Pastikan tidak ada session/local storage atau cookie.
6. Tambahkan navigasi manual ke campaign kedua.
7. Tambahkan WhatsApp URL dan pesan berbeda per iklan.
8. Pasang komponen hanya di homepage.
9. Tambahkan reduced motion dan responsive rules.
10. Uji reload, QR code, CTA, keyboard, touch, dan production build.

## Test Matrix

### Viewport

- 360x640.
- 375x667.
- 390x844.
- 768x1024.
- 1366x768.
- 1440x900.

### Interaction

- popup tampil pada setiap reload homepage;
- popup tampil setelah poster pertama selesai decode;
- close button;
- click backdrop;
- Escape;
- tab dan shift-tab;
- previous/next dan dot;
- CTA Green Tamarin;
- CTA Living Asia;
- focus kembali setelah close;
- background tidak scroll saat modal terbuka.

### Demo State

- tidak ada session/local storage atau cookie;
- close menutup popup untuk page view saat ini;
- reload menampilkan popup kembali;
- CTA tidak menekan tampilan berikutnya;
- popup selalu mulai dari iklan pertama;
- iklan kedua tersedia melalui navigasi manual.

### Visual

- logo, headline, cashback, QR code, dan nomor telepon tidak terpotong;
- close tidak menutupi informasi poster;
- CTA tetap terlihat pada layar pendek;
- poster tidak stretch;
- overlay tidak menyebabkan scroll jank;
- reduced motion tidak memakai scale/slide.

## Acceptance Criteria

- Popup menampilkan satu dari dua iklan aktif.
- Pengguna dapat berpindah promo secara manual.
- Green Tamarin mengarah ke 6281931151888 dengan pesan yang sesuai.
- Living Asia mengarah ke 628113900899 dengan pesan yang sesuai.
- Popup tampil pada setiap reload homepage setelah poster pertama siap.
- Tidak ada frequency cap, suppression 24 jam, atau suppression tujuh hari dalam mode demo.
- Close tersedia sejak frame pertama dan bekerja melalui click, backdrop, serta Escape.
- Focus trap, scroll lock, focus restore, dan keyboard navigation bekerja.
- QR code dan seluruh teks poster terlihat tanpa crop.
- Modal responsif di mobile, tablet, dan desktop.
- Tidak ada autoplay, suara, scroll hijacking, atau popup berulang.
- Production build berhasil tanpa console error.

## Definition of Done

Pekerjaan selesai ketika:

- dua campaign sudah terdata dan tervalidasi;
- popup muncul pada setiap reload homepage dalam mode demo;
- implementasi tidak memakai session storage, local storage, cookie, atau frequency cap;
- navigasi dua promo serta CTA WhatsApp bekerja;
- poster tampil utuh dan QR code dapat dipindai;
- seluruh interaction dan accessibility state bekerja;
- reduced motion dan edge case ditangani;
- semua acceptance criteria dan test matrix lulus pada production build.
