# Plan V2 - Parallax Tetap Jalan, Scroll Tetap Smooth

## Hasil yang Diinginkan

Website tetap terasa cinematic:

- smooth scroll di laptop;
- momentum touch natural di mobile;
- hero, image bleed, dan section utama tetap memiliki parallax;
- cinematic crossfade tetap ada;
- reveal text/card tetap berjalan;
- tidak ada patah-patah, loncat, pin tersangkut, atau gambar mendadak muncul saat scroll.

Masalahnya bukan GSAP harus dihapus. Masalah saat ini adalah terlalu banyak lapisan smoothing dan pekerjaan berat berjalan pada frame yang sama. Solusinya adalah satu scroll engine, transform-only animation, media ringan, dan level efek yang berbeda per perangkat.

## Arsitektur Target

### Laptop / desktop

- Lenis dipakai sebagai satu-satunya smooth-scroll engine.
- Lenis masuk ke GSAP ticker; tidak boleh punya RAF kedua.
- ScrollTrigger hanya membaca progress dari Lenis.
- Semua parallax memakai `scrub: true`, bukan numeric scrub seperti `1.1` atau `1.35`.
- Numeric scrub di atas Lenis dilarang karena menghasilkan smoothing ganda dan membuat animasi tertinggal dari scroll.
- Cinematic memakai CSS `position: sticky` dalam wrapper tinggi, bukan `ScrollTrigger pin`.
- WebGL tidak menjadi bagian jalur scroll. Efek cahaya diganti gradient CSS atau animasi yang berjalan maksimal 30 FPS dan hanya ketika terlihat.

### Mobile / touch

- Gunakan native scroll dan momentum browser; jangan memakai Lenis `syncTouch`.
- GSAP/ScrollTrigger tetap dipakai untuk parallax.
- Parallax mobile lebih pendek, sekitar 2-4% atau 12-24 px.
- Parallax hanya mengubah `transform`, tidak mengubah `top`, `height`, `filter`, `clip-path`, atau background position saat scroll.
- Cinematic memakai CSS sticky dengan maksimal dua gambar aktif pada saat yang sama.
- WebGL dimatikan. Hero video tidak autoplay; gunakan poster/gambar sebagai media awal.

### Reduced motion

- Semua konten langsung berada di state akhir.
- Tidak ada Lenis, parallax, crossfade otomatis, marquee, video autoplay, atau WebGL.

## Konfigurasi Efek

Gunakan `gsap.matchMedia()` dan satu konfigurasi sebagai sumber kebenaran:

```js
const motionConfig = {
  mobile: {
    smoothScroll: false,
    parallaxDistance: 20,
    cinematic: "sticky",
    webgl: false,
    heroVideo: false,
  },
  desktop: {
    smoothScroll: true,
    parallaxDistance: 70,
    cinematic: "sticky",
    webgl: false,
    heroVideo: true,
  },
};
```

Tambahkan atribut pada `<html>` atau root seperti `data-motion="mobile"`, `data-motion="desktop"`, atau `data-motion="reduced"`. Ini membuat setiap mode mudah diuji dan memudahkan mematikan satu efek saat mencari regresi.

## Fase 1 - Bereskan Media Sebelum Tuning GSAP (P0)

Perubahan ini wajib dilakukan lebih dahulu. Menambahkan `loading="lazy"` ke gambar multi-megabyte bukan optimasi yang cukup; browser tetap harus download dan decode file besar ketika pengguna mendekatinya.

### Gambar

- Konversi `green-asia-garden-home.jpg` sekitar 8,37 MB ke AVIF/WebP responsive.
- Konversi `polinesia-gable-home.jpg` sekitar 4,71 MB.
- Konversi `poolside-afternoon.png` sekitar 3,43 MB.
- Konversi `morning-at-home-living-maldives.jpeg` sekitar 2,73 MB.
- Konversi seluruh project/cinematic image lain yang masih di atas sekitar 500 KB.
- Buat minimal varian 480, 768, 1280, dan 1920 px bila memang dibutuhkan.
- Gunakan `<picture>`/`srcset`/`sizes`, atau refactor markup ke `next/image`.
- Tetapkan width-height atau `aspect-ratio` untuk setiap media.

Target praktis:

- mobile card: 80-180 KB;
- desktop card/cinematic: 150-350 KB;
- hero image: 150-300 KB;
- tidak ada gambar multi-megabyte di jalur scroll.

### Hero

- Jangan menaruh video dan lima gambar fullscreen sebagai enam layer aktif di posisi yang sama.
- Render hanya current slide dan next slide.
- Slide berikutnya baru dimasukkan setelah `img.decode()` selesai.
- Mobile memakai satu gambar/poster terlebih dahulu; video hanya setelah user interaction bila tetap diperlukan.
- Desktop video menggunakan versi responsive yang lebih kecil dan pause ketika hero keluar viewport.
- Autoplay slider berhenti saat hero tidak terlihat atau tab tersembunyi.

### Preload strategy

- Preload hanya media hero pertama.
- Media section berikutnya diprefetch ketika browser idle atau ketika jaraknya sekitar 1-1,5 viewport.
- Jangan memulai decode gambar 3-8 MB ketika event scroll sedang berjalan.

## Fase 2 - Satu Smooth Scroll Engine (P0)

### Desktop Lenis

- Pertahankan Lenis hanya pada `(min-width: 768px) and (pointer: fine)`.
- Gunakan GSAP ticker sebagai satu-satunya scheduler.
- Naikkan respons scroll dari konfigurasi sekarang yang terasa terlalu berat. Mulai pengujian dari `lerp` sekitar `0.1-0.14` dan `wheelMultiplier: 1`.
- Jangan mengurangi wheel multiplier menjadi `0.72` karena dapat terasa tertahan pada trackpad/mouse.
- Semua ScrollTrigger desktop memakai `scrub: true`.
- Pastikan `lenis.on("scroll", ScrollTrigger.update)` hanya didaftarkan satu kali dan dilepas saat cleanup.

Contoh bentuk integrasi:

```js
const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
const tick = (time) => lenis.raf(time * 1000);

gsap.ticker.add(tick);
lenis.on("scroll", ScrollTrigger.update);
```

Angka final dipilih dari pengujian trackpad dan mouse, bukan dari contoh ini saja.

### Mobile native scroll

- Lenis tidak dibuat di mobile.
- Jangan memakai `ScrollTrigger.normalizeScroll()` sebagai default.
- Anchor navigation memakai native `scrollIntoView({ behavior: "smooth" })`.
- ScrollTrigger tetap aktif untuk menghitung progress parallax dan reveal.

## Fase 3 - Bangun Ulang Parallax yang Ringan (P0)

Pertahankan tiga parallax penting saja:

1. hero media;
2. feature bleed image;
3. why-Meka image.

### Aturan implementasi

- Bungkus image dalam container `overflow: hidden`.
- Buat image sedikit lebih tinggi dari container agar transform tidak memperlihatkan ruang kosong.
- Animasikan `yPercent` atau `y` saja.
- Gunakan `ease: "none"` dan `scrub: true`.
- Jangan menganimasikan scale dan y secara bersamaan kecuali trace membuktikan aman.
- Jangan memasang `will-change` permanen ke semua gambar.
- Pasang `will-change: transform` hanya saat trigger aktif dan hapus saat keluar.
- Gunakan `invalidateOnRefresh: true` agar nilai kembali tepat setelah resize.

Contoh pola:

```js
gsap.fromTo(
  image,
  { yPercent: -4 },
  {
    yPercent: 4,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  }
);
```

Gunakan range sekitar `-2` ke `2` pada mobile dan `-5` ke `5` pada desktop sebagai titik awal. Range harus cukup terlihat tetapi tidak memerlukan texture/layer terlalu besar.

## Fase 4 - One Day With Meka Asia: Lebih Panjang dan Berbobot (P1)

Target rasa animasi:

- section terasa seperti rangkaian cerita, bukan slideshow yang cepat lewat;
- setiap waktu mendapat jeda baca sebelum berganti;
- crossfade terasa mantap dan halus;
- scroll tetap mengikuti input, tidak seperti ditahan atau ditarik paksa;
- pengguna masih bisa melewati section dengan flick cepat jika memang ingin.

Ganti `ScrollTrigger pin` dengan struktur CSS sticky:

```text
cinematic-wrapper (tinggi 450-550svh)
`-- cinematic-stage (position: sticky; top: 0; height: 100svh)
    |-- slide aktif
    |-- slide berikutnya
    |-- clock/label
    `-- progress
```

ScrollTrigger hanya membaca progress wrapper:

- tidak membuat pin spacer;
- tidak mengubah layout ketika pin aktif/nonaktif;
- hanya dua slide yang berada di compositor;
- opacity hanya ditulis ketika nilainya berubah;
- media slide berikutnya sudah selesai decode sebelum crossfade;
- mobile mulai dari `450svh` dan desktop mulai dari `550svh`;
- progress memakai `scaleX`, bukan width.

### Durasi dan pacing yang direkomendasikan

Gunakan lima scene dengan pembagian progress yang sengaja memberi waktu diam lebih lama daripada waktu transisi:

| Progress | Tampilan |
| --- | --- |
| 0-12% | 07:00 Morning at Home ditahan |
| 12-20% | Crossfade menuju 10:00 |
| 20-32% | 10:00 Entrance Walkthrough ditahan |
| 32-40% | Crossfade menuju 12:00 |
| 40-52% | 12:00 Living Room ditahan |
| 52-60% | Crossfade menuju 16:00 |
| 60-72% | 16:00 Poolside Afternoon ditahan |
| 72-80% | Crossfade menuju 19:00 |
| 80-100% | 19:00 Future Secured ditahan sebagai ending |

Artinya setiap scene memiliki ruang baca sekitar 12% progress, sedangkan crossfade memakai sekitar 8%. Ending diberi ruang lebih panjang agar section tidak terasa langsung membuang pengguna ke section berikutnya.

### Cara memberi rasa "berat" tanpa membuat scroll lag

- Jangan menambah numeric scrub di atas Lenis.
- Gunakan `scrub: true`; rasa panjang datang dari tinggi wrapper dan progress mapping.
- Saat sebuah scene aktif, tambahkan slow push-in sangat kecil, misalnya scale `1.00` ke `1.025`, sepanjang hold scene.
- Tambahkan pan maksimal sekitar 12-20 px pada desktop dan 6-10 px pada mobile.
- Clock dan label masuk selama bagian awal hold dengan opacity + translateY kecil.
- Clock/label keluar sedikit lebih dulu sebelum crossfade gambar selesai.
- Crossfade menggunakan opacity dua layer saja; slide lain harus `visibility: hidden` atau tidak dirender.
- Progress bar mengikuti keseluruhan wrapper secara linear agar pengguna tetap mengetahui posisi.
- Jangan memakai scroll locking, wheel interception, atau membatasi delta scroll. Efek harus terasa berbobot secara visual, bukan karena input pengguna diblokir.

### Parameter awal

```js
const cinematicConfig = {
  mobile: {
    wrapperHeight: "450svh",
    imageScale: 1.015,
    imagePan: 8,
  },
  desktop: {
    wrapperHeight: "550svh",
    imageScale: 1.025,
    imagePan: 16,
  },
};
```

Jika masih terasa terlalu cepat, naikkan tinggi wrapper per tahap `50svh`. Jangan langsung mengubah lerp Lenis atau menambahkan scrub delay karena itu akan memengaruhi seluruh halaman.

Jika terasa terlalu panjang, turunkan desktop ke `500svh` dan mobile ke `400svh`, tetapi pertahankan rasio hold/transisi agar storytelling tidak kembali terasa ringan.

Jika CSS sticky bermasalah, periksa ancestor yang memakai `overflow: hidden`, transform, filter, atau containment. Jangan langsung kembali ke GSAP pin sebelum penyebab sticky ditemukan.

## Fase 5 - Reveal dan Micro-animation (P1)

- Reveal `.rv` dan `.wipe` tetap ada.
- Mobile hanya opacity + translateY 10-14 px.
- Desktop opacity + translateY 18-24 px.
- Gunakan `once: true`.
- Batch callback boleh dipakai, tetapi pahami bahwa ScrollTrigger tetap membuat trigger per elemen.
- Elemen yang jauh di bawah fold harus memiliki fallback visible jika JS gagal.
- Jangan gunakan clip-path wipe di mobile.
- Counter hanya berjalan satu kali dan tidak menulis DOM setelah selesai.
- Navbar fixed tidak memakai backdrop blur di mobile.

## Fase 6 - Tinggi Viewport dan Refresh (P1)

- Mobile menggunakan `min-height: 100svh` untuk hero/sticky stage.
- Jangan menimpa `100svh` dengan `height: 100dvh`; `dvh` berubah saat address bar bergerak dan dapat menyebabkan layout bergerak ketika scroll.
- Desktop boleh menggunakan `100dvh`.
- Jalankan satu `ScrollTrigger.refresh()` setelah font dan media awal siap.
- Debounce refresh setelah orientation change.
- Jangan refresh pada setiap event resize mobile.

## Fase 7 - WebGL dan Efek Dekoratif (P2)

WebGL bukan bagian inti parallax. Kerjakan setelah scroll, media, parallax, dan cinematic sudah lolos target.

Jika tetap ingin WebGL di desktop:

- hanya satu canvas visible yang aktif;
- maksimal 30 FPS;
- render scale maksimal sekitar 0.75-1 DPR;
- pause saat canvas di luar viewport;
- pause saat tab hidden;
- gunakan gradient statis untuk mobile;
- sediakan feature flag agar WebGL bisa dimatikan tanpa mengubah kode lain.

Kalau mengaktifkan WebGL membuat p95 frame time melewati target, pertahankan gradient CSS. Parallax dan cinematic tetap berjalan tanpa WebGL.

## Urutan Implementasi

1. Buat dan pasang aset AVIF/WebP responsive.
2. Ubah hero agar hanya current-next slide yang dirender.
3. Pertahankan Lenis hanya di desktop pointer-fine dan hilangkan numeric scrub.
4. Implementasikan tiga parallax transform-only.
5. Ganti cinematic GSAP pin dengan CSS sticky.
6. Rapikan reveal, viewport height, refresh, dan cleanup.
7. Uji production build pada mobile dan laptop.
8. Baru pertimbangkan mengaktifkan WebGL desktop dengan feature flag.

Jangan mengerjakan semua efek sekaligus. Setelah setiap langkah, jalankan production build dan ulangi skenario scroll yang sama agar sumber regresi jelas.

## Test Matrix

Selalu uji dengan `npm run build` lalu `npm run start`, bukan hanya `npm run dev`.

### Mobile

- 375x667 dan 390x844.
- Android Chrome kelas menengah.
- iPhone Safari nyata.
- Scroll pelan, flick cepat, stop-start, rotate, background-resume.
- Pastikan parallax tetap mengikuti scroll dan tidak terlambat dari gesture.

### Laptop

- 1366x768 dan 1440x900.
- Mouse wheel dan trackpad diuji terpisah.
- Scroll cepat melewati hero, project cards, dan cinematic.
- Pastikan Lenis tidak terasa berat atau terus bergerak setelah input berhenti.
- Scroll normal di One Day With Meka Asia memberi waktu membaca setiap clock/label dan tidak melompati beberapa scene sekaligus.

### Reduced motion

- Semua konten terlihat.
- Tidak ada smooth-scroll override, parallax, autoplay, sticky cinematic progress, atau WebGL.

## Acceptance Criteria

- Parallax terlihat di mobile dan desktop tanpa ruang kosong di tepi gambar.
- Input scroll dan visual tidak terasa memiliki dua tahap delay.
- Tidak ada decode gambar multi-megabyte ketika pengguna berada di tengah gesture scroll.
- Maksimal dua media fullscreen aktif dalam hero/cinematic.
- Tidak ada pin spacer atau lompatan layout pada cinematic.
- One Day With Meka Asia memiliki hold yang jelas pada setiap scene, crossfade yang lebih lambat, dan ending 19:00 yang terasa selesai.
- Rasa berat cinematic berasal dari panjang wrapper dan visual pacing, bukan input lag atau scroll hijacking.
- Tidak ada long task berulang di atas 50 ms selama scroll.
- Target p95 frame time sekitar 20 ms atau lebih rendah pada perangkat utama 60 Hz.
- Tidak ada RAF, listener, timer, atau ScrollTrigger duplikat setelah remount.
- Parallax, hero, dan cinematic berhenti bekerja ketika section di luar viewport atau tab hidden.
- Build production berhasil tanpa console error.

## Definition of Done

Pekerjaan selesai jika:

- desktop memakai satu Lenis ticker tanpa numeric scrub;
- mobile memakai native scroll dengan parallax transform-only;
- hero hanya merender current dan next media;
- semua aset besar sudah memiliki varian responsive terkompresi;
- cinematic memakai CSS sticky dengan maksimal dua slide aktif;
- WebGL tidak mengganggu jalur scroll dan dapat dimatikan melalui feature flag;
- hasil sebelum-sesudah terdokumentasi pada perangkat mobile nyata dan laptop;
- semua acceptance criteria terpenuhi pada production build.
