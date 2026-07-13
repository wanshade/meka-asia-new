import Link from "next/link";
import KprCalculator from "./KprCalculator";
import styles from "./simulasi-kpr.module.css";

export const metadata = {
  title: "Simulasi KPR Mandiri | Meka Asia Property",
  description:
    "Hitung estimasi cicilan KPR Bank Mandiri untuk rencana pembelian properti Meka Asia.",
};

export const dynamic = "force-dynamic";

function getJakartaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function SimulasiKprPage() {
  const asOfDate = getJakartaDateKey();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logoLink} aria-label="Meka Asia home">
            <img
              src="/brand/meka-asia-logo-new.png"
              alt="Meka Asia"
              width={124}
              height={32}
              className={styles.logo}
            />
          </Link>
          <div className={styles.headerActions}>
            <a
              href="https://wa.me/6281931151888"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerCta}
            >
              Konsultasi
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Perencanaan Kepemilikan Rumah</span>
            <h1 className={`${styles.heroTitle} pf`}>
              Simulasi KPR Mandiri,
              <span> dibuat lebih mudah.</span>
            </h1>
            <p className={styles.heroText}>
              Atur harga rumah, uang muka, dan tenor untuk melihat estimasi
              cicilan sebelum berdiskusi dengan tim Meka Asia.
            </p>
          </div>
          <figure className={styles.heroVisual}>
            <img
              src="/hero/meka-asia.jpeg"
              alt="Hunian Meka Asia di Lombok"
              width={1600}
              height={900}
              decoding="async"
            />
            <div className={styles.heroVisualOverlay} aria-hidden="true" />
          </figure>
        </div>
      </section>

      <section className={styles.calculatorSection} aria-labelledby="calculator-title">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Mandiri KPR</span>
          <h2 id="calculator-title" className={`${styles.sectionTitle} pf`}>
            Rencanakan cicilan dengan angka yang transparan.
          </h2>
          <p>
            Hasil berubah sesuai input Anda. Data finansial diproses di perangkat
            dan tidak disimpan oleh halaman ini.
          </p>
        </div>
        <KprCalculator asOfDate={asOfDate} />
      </section>

      <section className={styles.helpSection}>
        <div>
          <span className={styles.eyebrow}>Butuh Bantuan?</span>
          <h2 className={`${styles.helpTitle} pf`}>
            Bawa hasil simulasi ke percakapan yang nyata.
          </h2>
        </div>
        <p>
          Tim Meka Asia dapat membantu mencocokkan rencana DP, pilihan unit,
          dokumen, dan langkah konsultasi dengan Bank Mandiri.
        </p>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link href="/">Kembali ke Beranda</Link>
          <a
            href="https://www.bankmandiri.co.id/in/kpr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Informasi resmi Mandiri KPR
          </a>
          <p>Copyright 2026 Meka Asia Property</p>
        </div>
      </footer>
    </main>
  );
}
