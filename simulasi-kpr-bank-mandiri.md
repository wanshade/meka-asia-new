# Plan Simulasi KPR Bank Mandiri — Meka Asia

## Tujuan

Membuat kalkulator KPR khusus Bank Mandiri di website Meka Asia untuk membantu calon pembeli memahami estimasi cicilan sebelum berkonsultasi dengan tim sales.

Kalkulator harus:

- fokus pada properti Meka Asia dan Bank Mandiri saja;
- menghitung estimasi secara transparan, bukan menjanjikan persetujuan kredit;
- mudah digunakan di iPhone, Android, tablet, dan laptop;
- terasa seperti bagian asli website Meka Asia;
- menggunakan data suku bunga yang memiliki sumber, tanggal verifikasi, dan tanggal kedaluwarsa;
- mengarahkan pengguna ke konsultasi Meka Asia atau kanal resmi Bank Mandiri.

Referensi [Simulasi KPR Rumah123](https://www.rumah123.com/kpr/simulasi-kpr/) hanya dipakai untuk mempelajari fungsi dasar seperti sinkronisasi DP, pemisahan input dan hasil, jadwal cicilan, serta analisis penghasilan. Jangan menyalin UI, warna, hero, layout kartu, tab, atau katalog multi-bank milik Rumah123.

## Design Brief

```text
Produk       : Kalkulator KPR untuk website Meka Asia
Bank         : Bank Mandiri saja
Interaksi    : Full interactive, hasil diperbarui secara langsung
Visual       : Design system Meka Asia yang sudah ada
Referensi    : Rumah123 untuk fungsi/alur, bukan tampilan
Tujuan akhir : Estimasi yang jelas lalu konsultasi dengan tim Meka Asia
```

## Sumber Resmi dan Snapshot Data

Gunakan sumber Bank Mandiri sebagai satu-satunya sumber produk dan rate:

- [Mandiri KPR](https://www.bankmandiri.co.id/in/kpr): KPR rumah tinggal dapat memiliki tenor hingga 30 tahun; uang muka disebut mulai dari 0%; syarat, risiko, dan keputusan kredit tetap mengikuti Bank Mandiri.
- [RIPLAY Mandiri KPR](https://www.bankmandiri.co.id/documents/20143/576636849/Mandiri%2BKPR.pdf/f9cd8412-c44c-5acd-ffe7-6be3cf91a998): rujukan tenor, batas usia saat kredit berakhir, risiko, dan kelompok biaya.
- [Kalkulator KPR Mandiri](https://www.bankmandiri.co.id/web/guest/kalkulator-kpr): rujukan input dan output fungsional; jangan menyalin tampilannya.
- [KPR Bunga Spesial 2026](https://www.bankmandiri.co.id/en/kpr-bunga-spesial): daftar program fixed berdasarkan kategori nasabah dan minimum tenor.
- [KPR Fixed Berjenjang 2026](https://www.bankmandiri.co.id/en/kpr-bunga-fixed-berjenjang): contoh skema 6,88% tahun 1–3, 8,88% tahun 4–6, dan 9,88% tahun 7–10 dengan minimum tenor 10 tahun.
- [Livin' KPR](https://www.bankmandiri.co.id/livin/kpr): konfirmasi bahwa Mandiri menyediakan simulasi angsuran/limit berdasarkan harga properti atau pendapatan.

Snapshot per 13 Juli 2026:

- program fixed berjenjang di atas memiliki batas pencairan 31 Juli 2026;
- rate promo tidak boleh dianggap permanen;
- kategori Gold, Silver, Bronze, payroll, dan selected developer dapat memiliki syarat berbeda;
- usia saat kredit berakhir pada informasi Mandiri tercantum maksimal 55 tahun untuk pegawai dan 60 tahun untuk profesional/wiraswasta;
- jangan menyatakan pengguna memenuhi kategori tertentu tanpa konfirmasi Bank Mandiri;
- keputusan persetujuan, plafon final, floating rate, biaya, dan syarat dokumen tetap milik Bank Mandiri.

## Keputusan Produk

- Buat halaman khusus `/simulasi-kpr`, bukan modal.
- Tambahkan CTA kecil dari Portfolio dan Consultation; jangan menambah terlalu banyak item di navbar desktop.
- Tidak ada pemilih bank karena kalkulator hanya untuk Mandiri.
- Program Mandiri boleh dipilih dari daftar yang sudah dikurasi dan masih berlaku.
- Jangan menyalin daftar Gold/Silver/Bronze Rumah123 secara mentah.
- Jangan meminta nama, nomor telepon, NIK, atau data sensitif untuk menghitung.
- Perhitungan berjalan sepenuhnya di browser dan tidak disimpan.
- CTA WhatsApp baru membawa pengguna keluar setelah tindakan eksplisit.
- Jangan memasukkan penghasilan pengguna ke pesan WhatsApp otomatis.

## Information Architecture

```text
/simulasi-kpr
|-- Intro singkat dan status data Mandiri
|-- Calculator shell
|   |-- Input rencana pembelian
|   |-- Pilihan skema Mandiri
|   `-- Ringkasan hasil sticky
|-- Jadwal estimasi cicilan per periode
|-- Analisis penghasilan opsional
|-- Penjelasan dan disclaimer
`-- CTA konsultasi Meka Asia / kanal resmi Mandiri
```

Di homepage, cukup tambahkan teaser pendek:

```text
Rencanakan cicilan rumah Anda
Hitung estimasi KPR Mandiri untuk properti Meka Asia.
[Simulasikan KPR]
```

## Alur Pengguna

1. Pengguna membuka halaman simulasi dari Portfolio, Consultation, atau footer.
2. Pengguna memasukkan harga properti.
3. Pengguna mengatur DP melalui persen atau nominal; kedua input selalu sinkron.
4. Pengguna memilih program Mandiri yang masih aktif.
5. Pengguna memilih tenor yang valid untuk program tersebut.
6. Hasil utama langsung diperbarui tanpa reload.
7. Pengguna membuka rincian jadwal cicilan per periode bila diperlukan.
8. Pengguna opsional memasukkan penghasilan untuk melihat rasio cicilan.
9. Pengguna melanjutkan ke WhatsApp Meka Asia atau sumber resmi Bank Mandiri.

Tidak perlu tombol `Simulasikan` jika hasil bisa diperbarui langsung. Pada mobile, update dapat dilakukan setelah input kehilangan fokus agar keyboard angka tidak terasa berat.

## Input Calculator

### Wajib

1. **Harga Properti**
   - format Rupiah;
   - numeric keyboard di mobile;
   - nilai minimum, maksimum, dan default berasal dari data harga Meka Asia, bukan angka acak;
   - dukung query parameter dari project card pada fase berikutnya.

2. **Uang Muka (DP)**
   - input persen dan nominal saling tersinkronisasi;
   - slider hanya sebagai pendamping, input angka tetap menjadi source of truth;
   - rentang teknis 0–90%, tetapi default produksi harus dikonfirmasi tim sales;
   - tampilkan error jika DP sama dengan atau melebihi harga properti.

3. **Program Mandiri**
   - hanya program yang telah diverifikasi dan belum kedaluwarsa;
   - label menjelaskan masa fixed, tier bunga, minimum tenor, dan masa berlaku;
   - tidak menjanjikan kategori atau eligibility.

4. **Tenor**
   - satuan tahun;
   - simulator Meka dibatasi maksimum 20 tahun sesuai keputusan produk, meskipun informasi Mandiri menyebut tenor rumah tinggal dapat mencapai 30 tahun;
   - minimum mengikuti konfigurasi program yang dipilih;
   - opsi yang tidak valid harus disabled, bukan menghasilkan error setelah dipilih.

### Opsional

5. **Penghasilan Bulanan**
   - hanya digunakan untuk menghitung rasio cicilan;
   - jangan menyimpan, mengirim, atau memasukkannya ke analytics;
   - jangan menyebut hasil sebagai keputusan kelayakan Bank Mandiri.

6. **Cicilan Bulanan Lain**
   - opsional dan hanya dipakai untuk gambaran ruang anggaran;
   - jangan disimpan atau dikirim ke WhatsApp/analytics;
   - helper text memberi contoh seperti kendaraan atau pinjaman aktif tanpa meminta detail sensitif.

7. **Usia dan Jenis Pekerjaan**
   - progressive disclosure di bagian `Cek batas tenor berdasarkan usia`;
   - gunakan hanya untuk memperingatkan bila usia saat kredit lunas melewati batas informasi Mandiri;
   - bukan screening atau keputusan eligibility.

8. **Project Meka Asia**
   - pilihan opsional agar harga dapat terisi otomatis setelah data harga resmi tersedia;
   - tetap beri opsi `Masukkan harga sendiri`.

## Output Calculator

Hasil yang selalu terlihat:

- estimasi plafon/pokok pinjaman;
- DP nominal;
- estimasi cicilan bulanan untuk periode aktif;
- tenor dan jumlah bulan;
- nama skema Mandiri;
- status `Terakhir diverifikasi` dan `Berlaku sampai`;
- CTA `Konsultasikan Hasil`.

Rincian yang dapat dibuka:

- jadwal cicilan per tier bunga;
- perkiraan sisa pokok setelah setiap periode fixed;
- estimasi bunga yang dibayar selama periode yang rate-nya diketahui;
- dana awal berupa DP + angsuran pertama;
- rincian biaya dipisahkan menjadi `dapat dihitung`, `estimasi biaya lainnya`, dan `ditentukan saat proses Bank Mandiri`;
- catatan bahwa admin, provisi, appraisal/taksasi, asuransi, pengikatan agunan, notaris, balik nama, pajak, dan biaya lain belum dimasukkan sampai nominal resmi dikonfirmasi;
- periode setelah fixed ditulis `mengikuti bunga floating Bank Mandiri` jika floating rate belum memiliki sumber yang valid.

Jika penghasilan diisi:

- tampilkan `Rasio cicilan terhadap penghasilan: xx%`;
- gunakan bahasa netral seperti `ruang anggaran lebih longgar`, `perlu ditinjau`, atau `pertimbangkan DP lebih besar`;
- sertakan teks `indikator perencanaan, bukan hasil persetujuan kredit`;
- jangan memakai label mutlak seperti `pasti lolos`, `layak`, atau `disetujui`.

## Model Perhitungan

Gunakan metode anuitas efektif per bulan:

```text
P = harga properti - DP
r = bunga tahunan / 12 / 100
n = tenor dalam bulan

angsuran = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Tangani bunga 0% secara terpisah:

```text
angsuran = P / n
```

Untuk fixed berjenjang:

1. Hitung angsuran tier pertama memakai sisa pokok dan seluruh sisa tenor.
2. Amortisasi pokok selama jumlah bulan pada tier tersebut.
3. Ambil sisa pokok pada akhir tier.
4. Hitung ulang angsuran memakai bunga tier berikutnya dan sisa tenor.
5. Ulangi sampai seluruh tier fixed selesai.
6. Jangan menghitung periode floating secara numerik jika rate floating belum dikonfirmasi.

Tampilkan pembulatan hanya pada UI. Perhitungan internal tetap memakai nilai presisi penuh agar jadwal tidak melenceng.

## Konfigurasi Rate Mandiri

Jangan menyebarkan angka bunga di dalam komponen. Gunakan satu konfigurasi:

```js
export const mandiriKprPrograms = [
  {
    id: "mandiri-fixed-berjenjang-2026",
    label: "Mandiri KPR Fixed Berjenjang 10 Tahun",
    eligibilityLabel: "Wajib dikonfirmasi Bank Mandiri",
    propertyType: "house",
    minTenorYears: 10,
    maxTenorYears: 20,
    tiers: [
      { months: 36, annualRate: 6.88 },
      { months: 36, annualRate: 8.88 },
      { months: 48, annualRate: 9.88 },
    ],
    floatingRate: null,
    verifiedAt: "2026-07-13",
    validUntil: "2026-07-31",
    sourceUrl:
      "https://www.bankmandiri.co.id/en/kpr-bunga-fixed-berjenjang",
  },
];
```

Aturan expiry:

- saat `validUntil` terlewati, program tidak boleh tetap tampil sebagai promo aktif;
- tampilkan state `Rate sedang diperbarui` dan CTA konsultasi;
- jangan diam-diam memakai rate lama;
- jika kalkulator harus tetap tersedia, sediakan `Masukkan rate dari penawaran Mandiri` dengan penjelasan bahwa nilai berasal dari pengguna;
- verifikasi rate kembali sebelum release dan minimal setiap awal bulan selama promo aktif.
- provisi, administrasi, asumsi biaya lain, batas usia, dan rasio kemampuan bayar juga harus berada dalam konfigurasi bertanggal—bukan konstanta di komponen.

## Visual Direction Meka Asia

### Tone

- premium, tenang, transparan, dan tidak terasa seperti marketplace;
- tidak memakai ilustrasi finansial generik, grafik warna-warni, atau banner bank yang ramai;
- data terasa serius tetapi tetap mudah dibaca.

### Warna

- background utama: ivory `#fcf9f3`;
- panel input: sand `#f6f1e7` atau putih hangat;
- panel hasil: deep forest `#173426`;
- angka cicilan dan active state: gold `#c49a4a`;
- teks utama: ink `#1f1b13`;
- border: `#e7ded0`.

### Tipografi

- Playfair Display untuk judul dan angka cicilan utama;
- Inter untuk label, input, helper text, tabel, dan disclaimer;
- angka finansial memakai `font-variant-numeric: tabular-nums` agar tidak bergeser saat berubah.

### Desktop

- calculator memakai grid dua kolom sekitar `55/45`;
- form di kiri dan result card forest di kanan;
- result card boleh sticky di dalam section, bukan fixed terhadap viewport;
- angka cicilan menjadi focal point;
- detail tier memakai tabel atau timeline tipis beraksen gold.

### Mobile

- satu kolom;
- ringkasan cicilan muncul setelah input utama, sebelum rincian;
- tidak ada sticky card tinggi yang menutup layar;
- CTA konsultasi dapat menjadi bottom bar setelah hasil valid;
- hormati safe area iPhone;
- input nominal minimal 16px agar Safari tidak melakukan auto zoom;
- slider memiliki target sentuh minimal 44px, tetapi input angka tetap tersedia.

### Motion

- tidak memakai GSAP, Lenis, parallax, atau ScrollTrigger;
- perubahan hasil menggunakan transition opacity/warna 120–180 ms;
- jangan menganimasikan setiap digit;
- reduced motion mematikan seluruh transition hasil.

## Komponen dan Struktur File

```text
app/
|-- simulasi-kpr/
|   |-- page.jsx
|   `-- KprCalculator.jsx
`-- components/
    `-- KprTeaser.jsx

lib/
|-- kprCalculations.js
`-- mandiriKprPrograms.js

tests/
`-- kprCalculations.test.js
```

Tanggung jawab:

- `page.jsx`: metadata, intro, source, disclaimer, dan composition;
- `KprCalculator.jsx`: state form, validation, formatting, dan interaction;
- `kprCalculations.js`: fungsi murni untuk anuitas, amortisasi, tier, dan rasio;
- `mandiriKprPrograms.js`: data Mandiri, masa berlaku, dan source URL;
- `KprTeaser.jsx`: CTA ringan dari homepage.

## Integrasi dengan Website Meka

- Tambahkan link `Simulasi KPR` pada footer.
- Tambahkan CTA sekunder dekat Consultation.
- Project card dapat mengirim `project` dan `price` melalui query parameter setelah daftar harga tersedia.
- CTA hasil membuka WhatsApp Meka Asia dengan pesan seperti:

```text
Halo Meka Asia, saya ingin konsultasi simulasi KPR Mandiri.
Project/Harga: ...
DP: ...
Tenor: ...
Estimasi cicilan periode fixed: ...
```

Jangan memasukkan penghasilan, rasio, atau data sensitif ke pesan.

Tambahkan link sekunder `Lihat informasi resmi Mandiri` yang membuka halaman Bank Mandiri di tab baru dengan `rel="noopener noreferrer"`.

## Trademark dan Kepercayaan

- Gunakan teks `Bank Mandiri`; jangan menampilkan logo Mandiri sebelum izin penggunaan aset dikonfirmasi.
- Jangan menyebut kalkulator ini sebagai kalkulator resmi Bank Mandiri.
- Jangan menyiratkan partnership bila belum ada kerja sama yang dapat dipublikasikan.
- Label yang disarankan: `Simulasi Mandiri KPR — estimasi oleh Meka Asia`.
- Tampilkan sumber dan tanggal verifikasi di dekat pilihan program, bukan hanya di footer.

## Disclaimer

Gunakan disclaimer yang jelas dan mudah dibaca:

> Simulasi ini hanya merupakan estimasi untuk membantu perencanaan dan bukan penawaran, persetujuan, atau keputusan kredit Bank Mandiri. Suku bunga, uang muka, cicilan, biaya, limit, tenor, dan kelayakan dapat berubah sesuai kebijakan serta hasil analisis Bank Mandiri. Apabila terdapat perbedaan, perhitungan pada dokumen perjanjian dan sistem Bank Mandiri yang berlaku.

Jika periode floating dihitung memakai asumsi, tampilkan rate, sumber, dan tanggal asumsi secara eksplisit. Ikuti prinsip keterbukaan informasi pada [FAQ Pedoman RIPLAY OJK](https://sikapiuangmu.ojk.go.id/FrontEnd/images/FileDownload/544_Booklet%20FAQ%20Pedoman%20RIPLAY_hires.pdf) dan [POJK 22 Tahun 2023](https://www.ojk.go.id/id/regulasi/Documents/Pages/Pelindungan-Konsumen-dan-Masyarakat-di-Sektor-Jasa-Keuangan/POJK%2022%20Tahun%202023%20Pelindungan%20Konsumen%20dan%20Masyarakat%20di%20Sektor%20Jasa%20Keuangan.pdf).

Jangan menyembunyikan disclaimer di tooltip saja.

## Accessibility

- Semua input memiliki `label` yang terlihat.
- Hubungkan helper/error text dengan `aria-describedby`.
- Gunakan `inputmode="numeric"` untuk Rupiah dan `inputmode="decimal"` untuk rate manual.
- Result summary menggunakan `aria-live="polite"`, tetapi update tidak boleh diumumkan pada setiap ketukan terlalu cepat.
- Slider dan input angka harus mengubah state yang sama.
- Jangan mengandalkan warna untuk status rasio atau error.
- Urutan focus mengikuti input → hasil → detail → CTA.
- Format `Rp` tetap memiliki label screen-reader yang jelas.

## Performa dan Privasi

- Kalkulator tidak membutuhkan library chart.
- Tidak ada network request saat pengguna mengubah input.
- Perhitungan harus selesai dalam satu frame dan tidak membuat scroll jank.
- Jangan memakai GSAP untuk angka atau form.
- Jangan menyimpan harga, DP, penghasilan, atau hasil ke cookie/local storage secara default.
- Analytics hanya mencatat event generik tanpa nilai finansial pengguna.

Event yang aman:

- `kpr_simulator_view`;
- `kpr_simulation_completed`;
- `kpr_program_selected` dengan id program publik;
- `kpr_whatsapp_click`;
- `kpr_official_source_click`.

## Edge Cases

- Harga kosong atau nol: hasil belum ditampilkan.
- DP melebihi harga: tampilkan error inline.
- Pokok pinjaman nol: jangan menjalankan rumus anuitas.
- Tenor di bawah minimum program: otomatis pindah ke minimum dan beri penjelasan.
- Rate program kedaluwarsa: blok simulasi promo dan tampilkan state pembaruan.
- Floating rate tidak diketahui: jangan mengarang cicilan setelah fixed.
- Rate 0%: gunakan pembagian pokok sederhana.
- Input paste berisi titik, koma, `Rp`, atau spasi: normalisasi dengan aman.
- Perubahan orientasi iPhone: state dan hasil tidak hilang.
- JavaScript gagal: tampilkan intro, disclaimer, dan CTA konsultasi; jangan tampilkan hasil palsu.

## Urutan Implementasi

1. Konfirmasi program Mandiri yang benar-benar berlaku untuk pembeli Meka Asia.
2. Validasi rate, minimum tenor, masa berlaku, dan biaya dengan sumber resmi.
3. Buat konfigurasi program dan expiry guard.
4. Buat fungsi anuitas, sisa pokok, staged rate, dan rasio.
5. Tambahkan unit test fungsi perhitungan.
6. Buat route `/simulasi-kpr` dan shell Meka Asia.
7. Implementasikan input Rupiah, DP sinkron, program, dan tenor.
8. Implementasikan result summary dan timeline tier.
9. Tambahkan analisis penghasilan opsional.
10. Tambahkan disclaimer, sumber, tanggal verifikasi, dan CTA.
11. Tambahkan teaser homepage serta link footer.
12. Uji keyboard, mobile Safari, Android Chrome, dan production build.
13. Verifikasi ulang semua rate tepat sebelum deployment.

## Test Matrix

### Formula

- single fixed rate;
- tiga tier fixed berjenjang;
- bunga 0%;
- DP 0%, 20%, dan 90%;
- tenor minimum dan maksimum;
- pembulatan Rupiah;
- sisa pokok setelah setiap tier;
- floating rate kosong.

Bandingkan minimal tiga skenario dengan spreadsheet independen dan toleransi maksimal Rp1 pada fungsi inti sebelum pembulatan UI.

### Validation

- input kosong;
- karakter non-angka;
- paste `Rp 1.500.000.000`;
- DP lebih besar dari harga;
- tenor tidak memenuhi minimum program;
- program sudah expired;
- penghasilan nol atau lebih kecil dari cicilan.

### Viewport

- 320×568;
- 375×667;
- 390×844;
- 430×932;
- 768×1024;
- 1366×768;
- 1440×900.

### Device dan Interaction

- Safari iPhone portrait dan landscape;
- Chrome Android;
- Safari/Chrome laptop;
- numeric keyboard;
- tab dan shift-tab;
- screen reader result announcement;
- reduced motion;
- back/forward navigation tanpa kehilangan kestabilan layout.

## Acceptance Criteria

- Hanya Bank Mandiri yang tampil.
- UI tidak menyerupai Rumah123 dan konsisten dengan Meka Asia.
- Harga, DP persen, dan DP nominal selalu sinkron.
- Program expired tidak tampil sebagai rate aktif.
- Tenor mengikuti batas program dan rumah tinggal Mandiri.
- Single-rate dan staged-rate memakai anuitas efektif yang benar.
- Cicilan, plafon, sisa pokok, dan timeline tier ditampilkan jelas.
- Floating period tanpa rate terverifikasi tidak menghasilkan angka palsu.
- Analisis penghasilan tidak diklaim sebagai keputusan bank.
- Disclaimer, sumber, tanggal verifikasi, dan masa berlaku terlihat.
- Tidak ada data finansial pribadi yang disimpan atau dikirim otomatis.
- CTA WhatsApp tidak menyertakan penghasilan pengguna.
- Mobile tidak auto zoom, overflow, atau tertutup keyboard/safe area.
- Kalkulator bekerja tanpa GSAP dan tidak menambah scroll jank.
- Unit test formula dan production build lulus.

## Definition of Done

Pekerjaan selesai ketika:

- program Mandiri yang digunakan telah dikonfirmasi dan belum kedaluwarsa;
- fungsi perhitungan telah diverifikasi dengan test independen;
- halaman `/simulasi-kpr` responsif serta dapat diakses;
- hasil, sumber, disclaimer, dan expiry state tampil benar;
- CTA konsultasi dan link resmi Mandiri bekerja;
- tidak ada klaim partnership, eligibility, atau rate permanen yang menyesatkan;
- seluruh acceptance criteria dan test matrix lulus pada production build.
