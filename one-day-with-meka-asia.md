# One Day With Meka Asia

## Tujuan

Membuat section "One Day With Meka Asia" terasa lebih panjang, cinematic, dan berbobot tanpa membuat scroll terasa macet atau patah-patah.

Efek yang diinginkan:

- setiap scene memiliki waktu tampil yang cukup untuk dibaca;
- perpindahan gambar tidak terasa terlalu cepat;
- gambar memiliki slow push-in dan pan yang halus;
- clock, label, dan progress bergerak selaras dengan gambar;
- scroll tetap mengikuti input pengguna;
- mobile dan laptop memiliki pacing yang konsisten;
- pengguna tetap dapat melewati section dengan flick cepat.

## Arsitektur

Gunakan CSS sticky, bukan `ScrollTrigger pin`:

```text
cinematic-wrapper (450-550svh)
`-- cinematic-stage (position: sticky; top: 0; height: 100svh)
    |-- slide aktif
    |-- slide berikutnya
    |-- clock dan label
    `-- progress bar
```

ScrollTrigger hanya membaca progress dari wrapper. Tidak ada pin spacer dan tidak ada perubahan layout ketika section mulai atau selesai.

Aturan utama:

- hanya dua slide yang aktif di DOM/compositor;
- slide berikutnya harus selesai decode sebelum crossfade;
- gambar lain memakai `visibility: hidden` atau tidak dirender;
- progress bar dianimasikan dengan `scaleX`;
- gambar hanya dianimasikan menggunakan transform dan opacity;
- gunakan `scrub: true`, bukan numeric scrub;
- jangan memakai scroll locking atau wheel interception.

## Panjang Section

Gunakan parameter awal:

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

Penyesuaian:

- jika terlalu cepat, naikkan tinggi wrapper per `50svh`;
- jika terlalu panjang, gunakan `400svh` di mobile dan `500svh` di desktop;
- jangan memperlambat lerp Lenis untuk mengubah durasi section;
- jangan menambahkan numeric scrub karena akan menciptakan smoothing ganda.

## Timeline Scene

Gunakan lima scene dengan waktu hold lebih panjang daripada crossfade:

| Progress | Scene |
| --- | --- |
| 0-12% | 07:00 - Morning at Home ditahan |
| 12-20% | Crossfade menuju 10:00 |
| 20-32% | 10:00 - Entrance Walkthrough ditahan |
| 32-40% | Crossfade menuju 12:00 |
| 40-52% | 12:00 - Living Room ditahan |
| 52-60% | Crossfade menuju 16:00 |
| 60-72% | 16:00 - Poolside Afternoon ditahan |
| 72-80% | Crossfade menuju 19:00 |
| 80-100% | 19:00 - Future Secured ditahan sebagai ending |

Rasio awal:

- hold scene: sekitar 12% progress;
- crossfade: sekitar 8% progress;
- ending: sekitar 20% progress.

Ending dibuat lebih panjang supaya cerita terasa selesai sebelum pengguna masuk ke section berikutnya.

## Scene Asset Mapping

Setiap scene harus memakai gambar yang berbeda dan sesuai ceritanya:

| Waktu | Label | Aset |
| --- | --- | --- |
| 07:00 | Morning at Home | `morning-at-home-living-maldives` |
| 10:00 | Entrance Walkthrough | `living-asia-entrance-visit` |
| 12:00 | Living Room | `living-room-maldives` |
| 16:00 | Poolside Afternoon | `poolside-afternoon` |
| 19:00 | Future Secured | `future-secured` - gambar interior tangga |

Catatan penting untuk scene 19:00:

- jangan memakai `consultation-pool` karena gambar tersebut dipakai untuk konteks consultation/reserve dan tidak mewakili ending yang sama;
- jangan memakai ulang salah satu dari empat gambar sebelumnya;
- gunakan gambar interior tangga yang sudah dipilih dengan nama dasar `future-secured`;
- gunakan varian `future-secured-480`, `future-secured-768`, dan `future-secured-1280` dalam AVIF/WebP;
- arah visualnya adalah interior rumah yang hangat, rapi, aman, dan terasa seperti penutup perjalanan satu hari;
- jika aset final belum tersedia, gunakan placeholder lokal yang jelas dan jangan mengambil gambar eksternal acak sebagai final production asset.

## Motion Direction

### Image

- Scene aktif melakukan slow push-in kecil.
- Desktop: scale maksimal sekitar `1.025`, pan sekitar 12-20 px.
- Mobile: scale maksimal sekitar `1.015`, pan sekitar 6-10 px.
- Arah pan dapat bergantian kiri-kanan agar setiap scene tidak terasa sama.
- Jangan menganimasikan filter, blur, width, height, atau background-position.

### Crossfade

- Crossfade hanya melibatkan current slide dan next slide.
- Current slide bergerak dari opacity 1 ke 0.
- Next slide bergerak dari opacity 0 ke 1.
- Push-in current slide boleh terus berjalan selama crossfade.
- Next slide mulai dari scale sedikit lebih kecil lalu mencapai target selama hold berikutnya.

### Clock dan label

- Clock dan label masuk pada awal hold.
- Gunakan opacity dan translateY kecil sekitar 8-14 px.
- Clock/label mulai keluar sedikit lebih awal sebelum crossfade gambar selesai.
- Update text hanya ketika active scene berubah, bukan pada setiap frame.

### Progress bar

- Progress mengikuti keseluruhan wrapper secara linear.
- Gunakan `transform: scaleX(progress)`.
- Tetapkan `transform-origin: left center`.
- Progress bar tidak memakai transition CSS tambahan karena progress sudah dikendalikan scroll.

## Mobile

- Gunakan native scroll.
- Jangan membuat Lenis di perangkat touch.
- Sticky stage menggunakan `height: 100svh`.
- Wrapper mulai dari `450svh`.
- Parallax/push-in dibuat lebih pendek daripada desktop.
- WebGL dimatikan.
- Pastikan fixed address bar tidak mengubah tinggi stage ketika gesture sedang berlangsung.

## Desktop

- Lenis boleh digunakan sebagai satu-satunya smooth-scroll engine.
- Integrasikan Lenis ke GSAP ticker.
- ScrollTrigger menggunakan `scrub: true`.
- Wrapper mulai dari `550svh`.
- Jangan memakai numeric scrub di atas Lenis.
- WebGL tetap terpisah dari cinematic dan harus dapat dimatikan melalui feature flag.

## Media

- Semua cinematic image harus memiliki varian AVIF/WebP responsive.
- Scene `Future Secured` wajib memakai aset khusus `future-secured`, bukan `consultation-pool`.
- Target ukuran sekitar 150-350 KB per gambar desktop.
- Mobile menggunakan varian resolusi dan ukuran file yang lebih kecil.
- Tetapkan width-height atau aspect ratio.
- Preload slide pertama saja.
- Prefetch dan decode next slide sebelum transisi dimulai.
- Jangan menunggu pengguna masuk ke crossfade untuk mulai decode gambar multi-megabyte.

## Urutan Implementasi

1. Tambahkan aset khusus `future-secured`, lalu kompres dan buat varian responsive untuk seluruh cinematic image.
2. Buat wrapper dengan tinggi `450svh` mobile dan `550svh` desktop.
3. Jadikan stage `position: sticky` dan `height: 100svh`.
4. Buat progress mapping hold-crossfade sesuai tabel timeline.
5. Render hanya current dan next slide.
6. Tambahkan slow push-in dan pan transform-only.
7. Tambahkan animasi clock, label, dan progress.
8. Tambahkan preload/decode next slide.
9. Uji production build dengan mouse, trackpad, dan touch.
10. Sesuaikan tinggi wrapper per `50svh` sampai pacing terasa tepat.

## Pengujian

Selalu uji menggunakan:

```bash
npm run build
npm run start
```

Skenario wajib:

- scroll pelan melewati semua scene;
- mouse wheel normal;
- trackpad scroll pendek dan panjang;
- flick cepat di mobile;
- berhenti di tengah crossfade lalu lanjut scroll;
- scroll balik ke scene sebelumnya;
- rotate mobile;
- pindah tab lalu kembali;
- reduced motion.

## Acceptance Criteria

- Setiap scene memiliki hold yang jelas dan cukup untuk membaca clock/label.
- Crossfade terasa lebih lambat dan tidak seperti slideshow ringan.
- Scene 19:00 memiliki ending yang terasa selesai.
- Scene 19:00 memakai gambar `future-secured` yang berbeda dari consultation pool dan empat scene sebelumnya.
- Scroll tetap responsif dan tidak terasa ditahan.
- Normal mouse wheel atau trackpad tidak langsung melewati beberapa scene.
- Flick cepat tetap dapat melewati section tanpa tersangkut.
- Tidak ada pin spacer, layout jump, blank image, atau flash saat crossfade.
- Maksimal dua gambar fullscreen aktif pada waktu yang sama.
- Tidak ada decode gambar besar saat crossfade sedang berjalan.
- Tidak ada numeric scrub di atas Lenis.
- Tidak ada long task berulang di atas 50 ms saat scroll.
- Target p95 frame time sekitar 20 ms atau lebih rendah pada perangkat utama 60 Hz.
- Reduced motion menampilkan informasi tanpa sticky storytelling atau animasi bergerak.
- Build production berhasil tanpa console error.

## Definition of Done

Section dianggap selesai jika:

- memakai CSS sticky dan bukan GSAP pin;
- mobile menggunakan wrapper sekitar `450svh`;
- desktop menggunakan wrapper sekitar `550svh`;
- pacing mengikuti rasio hold-crossfade yang ditentukan;
- hanya current dan next slide yang aktif;
- media responsive sudah dikompres;
- slow push-in, pan, clock, label, dan progress berjalan sinkron;
- scroll tetap natural di mobile dan smooth di laptop;
- semua acceptance criteria terpenuhi pada production build.
