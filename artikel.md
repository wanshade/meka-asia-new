# Plan Section Artikel Meka Asia

## Tujuan

Membuat section editorial "News & Recognition" yang menampilkan lima artikel penghargaan PT. Meka Asia Properti. Section harus mengikuti visual website saat ini: premium, tenang, menggunakan warna forest, ivory, gold, font Playfair Display untuk judul, dan Inter untuk isi.

Sumber konten sudah tersedia:

- `artikel1.md`
- `artikel2.md`
- `artikel3.md`
- `artikel4.md`
- `artikel5.md`
- lima foto di `public/artikel`

Rencana ini belum mengimplementasikan UI. Dokumen ini menjadi acuan untuk penulisan artikel, pemetaan aset, routing, desain section, dan verifikasi.

## Keputusan Struktur

### Homepage

Ganti section `AWARDS` generik yang sekarang ada di homepage dengan section artikel berbasis penghargaan nyata. Jangan menambahkan section baru di samping section Awards lama karena akan membuat konten recognition terasa berulang.

Urutan halaman yang direkomendasikan:

```text
One Day With Meka Asia
Numbers
News & Recognition
Testimonials
FAQ
Consultation
Footer
```

### Halaman artikel

Sediakan:

- section listing di homepage;
- halaman indeks `/artikel` bila seluruh artikel perlu dilihat bersama;
- lima detail route `/artikel/[slug]`;
- related articles di akhir setiap detail page.

Jika scope awal ingin lebih kecil, homepage dapat langsung mengarah ke lima detail route tanpa membuat `/artikel` terlebih dahulu. Namun struktur konten tetap harus siap untuk indeks artikel di tahap berikutnya.

## Pemetaan Artikel dan Foto

Semua foto sumber berukuran `948x721` dengan rasio sekitar `1.31`. Gunakan frame `aspect-ratio: 4 / 3` agar gambar tidak terpotong berlebihan.

| File | Judul Tampilan | Slug | Foto Sumber |
| --- | --- | --- | --- |
| `artikel1.md` | Millennial Choice of The Year oleh Bank BTN Syariah 2022 | `millennial-choice-btn-syariah-2022` | `public/artikel/Millennial Choice of The Year oleh Bank BTN Syariah 2022.jpg` |
| `artikel2.md` | Approval Terbanyak dan Desain Rumah Subsidi Terbaik 2022 | `approval-terbanyak-desain-rumah-subsidi-2022` | `public/artikel/Penghargaan kepada PT. Meka Asia Properti atas Approval terbanyak dan desain rumah subsidi terbaik tahun 2022 oleh Bank NTB Syariah.jpg` |
| `artikel3.md` | Green Asia Raih Silver Winner REI Excellence Award 2022 | `green-asia-silver-winner-rei-2022` | `public/artikel/Sliver Winner - Perumahan Green Asia by PT. Meka Asia Properti - pemenang proyek terbaik dari DPD REI Pusat FIABCI Indonesia (REI Excellence Award 2022).jpg` |
| `artikel4.md` | Melanesia Raih Gold Winner REI Excellence Award 2023 | `melanesia-gold-winner-rei-2023` | `public/artikel/Melanesia dianugerahkan sebagai Pemenang Proyek Terbaik dari DPD REI PUSAT pada acara FIABCI Indonesia - REI Excellence Award 2023 di Jakarta dan meraih Gold Winner.jpg` |
| `artikel5.md` | PT. Meka Asia Properti Raih Gold Winner REI Excellence Award 2024 | `meka-asia-gold-winner-rei-2024` | `public/artikel/PT. Meka Asia Properti Raih Gold Winner pada REI Excellence Award 2024.jpg` |

Catatan editorial:

- perbaiki typo `Sliver Winner` menjadi `Silver Winner` pada judul tampilan dan isi;
- nama file sumber boleh tetap agar aset tidak rusak, tetapi gunakan slug pendek untuk URL dan output gambar teroptimasi;
- jangan mengubah nama lembaga, nama proyek, kategori penghargaan, atau tahun tanpa verifikasi;
- jangan menambahkan tanggal acara, lokasi, kutipan, nilai transaksi, atau angka statistik yang tidak tersedia di sumber.

## Format `artikel1.md` sampai `artikel5.md`

Normalisasi setiap file menjadi Markdown dengan frontmatter:

```md
---
title: "Judul artikel"
slug: "slug-artikel"
year: 2024
category: "Awards & Recognition"
excerpt: "Ringkasan 140-180 karakter."
image: "/artikel/nama-file.jpg"
imageAlt: "Deskripsi faktual isi foto"
featured: false
---

Isi artikel...
```

`artikel5.md` menggunakan `featured: true` karena merupakan penghargaan terbaru. Artikel lain menggunakan `featured: false`.

### Target isi

- setiap artikel minimal 500 kata;
- target ideal 600-800 kata agar cukup informatif tanpa terlalu panjang;
- paragraf pendek, sekitar 2-4 kalimat;
- satu H1 dari frontmatter, sehingga body dimulai dari paragraf atau H2;
- gunakan Bahasa Indonesia yang formal tetapi mudah dibaca;
- jangan mengulang kalimat yang sama hanya untuk memenuhi jumlah kata;
- bedakan sudut pembahasan setiap artikel.

### Struktur isi setiap artikel

1. Lead: penghargaan apa yang diterima dan oleh proyek/perusahaan mana.
2. Konteks: arti pencapaian bagi Meka Asia dan konsumen.
3. Kualitas proyek: desain, perencanaan, kenyamanan, atau akses pembiayaan yang relevan.
4. Dampak: kepercayaan konsumen, kontribusi perumahan, dan penguatan standar internal.
5. Komitmen berikutnya: peningkatan kualitas dan pelayanan tanpa klaim baru yang tidak terverifikasi.
6. CTA: ajakan melihat portfolio atau konsultasi dengan tim Meka Asia.

### Fokus artikel

- Artikel 1: relevansi hunian bagi generasi milenial dan akses pembiayaan syariah.
- Artikel 2: kualitas rumah subsidi, proses approval, dan hunian layak yang tetap dirancang baik.
- Artikel 3: Green Asia, kualitas pengembangan kawasan, dan arti Silver Winner 2022.
- Artikel 4: Melanesia, standar proyek, desain kawasan, dan pencapaian Gold Winner 2023.
- Artikel 5: pencapaian 2024 sebagai featured story dan kesinambungan kualitas portfolio Meka Asia.

## Desain Section Homepage

### Header

- Eyebrow: `News & Recognition`.
- Heading: `Prestasi yang Dibangun dari Kepercayaan`.
- Deskripsi pendek: pencapaian Meka Asia dalam pengembangan hunian berkualitas di Lombok.
- Link sekunder: `Lihat Semua Artikel`, ditampilkan hanya jika route `/artikel` dibuat.

### Layout desktop

- Artikel 5 menjadi featured card besar.
- Featured card menggunakan grid sekitar `1.15fr 0.85fr`: gambar di kiri, konten di kanan.
- Empat artikel lain menggunakan grid dua kolom.
- Gunakan maksimal lebar container yang sama dengan section lain, sekitar `1180px`.
- Jarak antar-card sekitar 20-28 px.
- Gambar memakai rasio 4:3 dan `object-fit: cover`.

### Layout tablet

- Featured card tetap full-width.
- Empat card lain menjadi grid dua kolom.
- Judul dibatasi sekitar tiga baris agar tinggi card konsisten.

### Layout mobile

- Semua card menjadi satu kolom.
- Featured card tidak memakai split layout; gambar berada di atas konten.
- Padding horizontal mengikuti halaman, sekitar 20 px.
- Gambar mempertahankan rasio 4:3.
- Tidak ada hover-only information; seluruh metadata penting selalu terlihat.

### Card content

Setiap card memuat:

- foto;
- badge `Awards & Recognition`;
- tahun penghargaan;
- judul;
- excerpt maksimal dua atau tiga baris;
- link `Baca Selengkapnya`;
- seluruh card boleh menjadi link, tetapi tetap berikan focus state yang jelas.

### Visual style

- Background section: ivory atau sand.
- Card: ivory terang dengan border `#e7ded0`.
- Heading: ink `#1f1b13`.
- Badge/link: gold `#c49a4a`.
- CTA/focus: forest `#204130`.
- Radius mengikuti card yang sudah ada, sekitar 8-12 px.
- Hover desktop cukup menggunakan image scale kecil dan perubahan warna link.
- Mobile tidak memakai hover transform.

## Desain Detail Artikel

### Hero artikel

- Breadcrumb: `Home / Artikel / Judul`.
- Badge kategori dan tahun.
- H1 dengan panjang baris maksimal sekitar 12-14 kata visual per baris.
- Excerpt di bawah H1.
- Hero image 4:3 atau maksimal `948x721`, tanpa crop agresif.

### Body

- Lebar kolom baca sekitar 680-760 px.
- Font body 16-18 px dengan line-height 1.7-1.8.
- Gunakan H2 untuk memecah artikel panjang.
- Link memiliki underline atau indikator yang tidak hanya mengandalkan warna.
- Sisipkan CTA konsultasi setelah isi, bukan di tengah artikel.

### Footer artikel

- CTA `Lihat Portfolio` dan `Konsultasi`.
- Related articles maksimal tiga card.
- Jangan menampilkan artikel yang sedang dibaca sebagai related item.
- Tombol kembali ke daftar artikel.

## Animasi

- Header section memakai reveal opacity + translateY ringan.
- Card memakai reveal satu kali.
- Desktop image hover maksimal scale sekitar `1.03`.
- Tidak ada parallax berat pada grid artikel.
- Detail hero boleh memakai parallax sangat ringan, tetapi harus transform-only dan dihentikan pada reduced motion.
- `prefers-reduced-motion` menampilkan semua konten langsung pada state akhir.

## Media Pipeline

Foto sumber relatif kecil, tetapi tetap buat format modern:

- output width: 480, 768, dan maksimal 948 px;
- format: AVIF dan WebP;
- simpan output dengan slug pendek, misalnya `/media/artikel/meka-asia-gold-winner-rei-2024-768.webp`;
- jangan melakukan upscale ke 1280/1920 karena sumber hanya 948 px;
- gunakan `srcset` dan `sizes`;
- featured image diprioritaskan hanya jika langsung berada di viewport;
- card lain memakai `loading="lazy"` dan `decoding="async"`;
- tetapkan width-height untuk mencegah layout shift.

## Routing dan Data

Rekomendasi implementasi Next.js:

```text
content/
`-- artikel/
    |-- artikel1.md
    |-- artikel2.md
    |-- artikel3.md
    |-- artikel4.md
    `-- artikel5.md

app/
`-- artikel/
    |-- page.jsx
    `-- [slug]/
        `-- page.jsx
```

Pilihan lain adalah mempertahankan Markdown di root, tetapi folder `content/artikel` lebih jelas dan mudah dikembangkan.

Data layer harus:

- membaca frontmatter;
- mengurutkan artikel berdasarkan `year` dan urutan editorial;
- menemukan artikel berdasarkan slug;
- menghasilkan 404 untuk slug yang tidak ada;
- menyediakan excerpt dan metadata untuk card;
- menyediakan related articles;
- tidak memasukkan HTML mentah tanpa sanitasi.

## SEO dan Semantik

- Buat metadata unik untuk setiap detail page.
- Gunakan canonical URL saat domain production tersedia.
- Tambahkan Open Graph image dari foto artikel.
- Gunakan elemen `<article>`, `<header>`, `<time>`, dan heading hierarchy yang benar.
- Tambahkan JSON-LD `Article` hanya jika author/publisher dan tanggal publikasi dapat diisi secara faktual.
- Jangan mengarang tanggal publikasi; gunakan tahun penghargaan sebagai metadata tampilan bila tanggal lengkap belum tersedia.

## Accessibility

- Alt text menjelaskan foto secara faktual, bukan mengulang judul artikel.
- Semua card dapat diakses dengan keyboard.
- Focus ring terlihat jelas di background ivory maupun forest.
- Judul link harus deskriptif.
- Jangan meletakkan teks penting langsung di atas foto tanpa overlay kontras yang cukup.
- Touch target minimal nyaman untuk mobile.
- Reduced motion didukung.

## Urutan Implementasi

1. Rapikan dan lengkapi `artikel1.md` sampai `artikel5.md` menjadi minimal 500 kata.
2. Tambahkan frontmatter dan slug sesuai tabel pemetaan.
3. Pindahkan konten ke `content/artikel` bila data layer Markdown digunakan.
4. Buat varian AVIF/WebP 480, 768, dan 948 px dengan nama slug pendek.
5. Buat loader Markdown dan validasi field wajib.
6. Ganti section Awards generik di homepage dengan `News & Recognition`.
7. Buat detail route lima artikel.
8. Buat halaman indeks `/artikel` jika masuk scope implementasi.
9. Tambahkan related articles, CTA, metadata, dan accessibility state.
10. Verifikasi production build dan seluruh route.

## Test Matrix

### Konten

- Lima judul, foto, tahun, slug, dan isi terpetakan dengan benar.
- Tidak ada typo `Sliver Winner` pada UI.
- Setiap artikel minimal 500 kata.
- Tidak ada klaim baru yang tidak didukung sumber.

### Responsive

- 375x667 dan 390x844.
- 768x1024.
- 1366x768 dan 1440x900.
- Tidak ada judul panjang yang keluar card.
- Foto penghargaan tetap terbaca dan tidak terpotong berlebihan.

### Interaction

- Semua card membuka slug yang benar.
- Back navigation bekerja.
- Related article tidak mengarah ke artikel yang sedang dibaca.
- Keyboard focus dan reduced motion bekerja.

### Technical

- `npm run build` berhasil.
- Lima detail route dapat dibuat statis.
- Tidak ada broken image atau request ke nama file yang salah.
- Tidak ada layout shift saat gambar dimuat.
- Tidak ada console error.

## Acceptance Criteria

- Homepage memiliki satu section artikel berisi tepat lima penghargaan nyata.
- Artikel 2024 tampil sebagai featured story.
- Empat artikel lain tampil sebagai grid yang konsisten.
- Setiap card menggunakan foto yang sesuai dari `public/artikel`.
- Lima file artikel memiliki frontmatter lengkap dan isi minimal 500 kata.
- Setiap artikel memiliki URL slug yang pendek dan stabil.
- Visual mengikuti forest, ivory, gold, Playfair Display, dan Inter dari website sekarang.
- Section responsif di mobile, tablet, dan laptop.
- Gambar tersedia dalam AVIF/WebP tanpa upscale melebihi 948 px.
- Detail article nyaman dibaca dan memiliki CTA serta related articles.
- Accessibility, SEO dasar, dan reduced motion terpenuhi.
- Production build berhasil tanpa broken route atau broken asset.

## Definition of Done

Pekerjaan dianggap selesai ketika:

- `artikel1.md` sampai `artikel5.md` sudah dinormalisasi dan dilengkapi;
- mapping foto dan slug mengikuti dokumen ini;
- Awards generik sudah diganti dengan section artikel aktual;
- lima detail article dapat dibuka;
- halaman indeks artikel tersedia jika dipilih dalam scope;
- semua acceptance criteria dan test matrix terpenuhi pada production build.
