"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateKprSimulation,
  isProgramActive,
  parseRupiahInput,
  validateKprInputs,
} from "../../lib/kprCalculations";
import { mandiriKprPrograms } from "../../lib/mandiriKprPrograms";
import styles from "./simulasi-kpr.module.css";

const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatInputNumber(value) {
  return value > 0 ? numberFormatter.format(Math.round(value)) : "";
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "—";
  return currencyFormatter.format(Math.round(value)).replace("Rp", "Rp ");
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

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

function tierPeriodLabel(tier) {
  const startYear = Math.floor((tier.startMonth - 1) / 12) + 1;
  const endYear = Math.ceil(tier.endMonth / 12);
  return startYear === endYear
    ? `Tahun ke-${startYear}`
    : `Tahun ${startYear}–${endYear}`;
}

function ratioMessage(ratio) {
  if (!Number.isFinite(ratio)) return null;
  if (ratio <= 30) {
    return {
      tone: "comfortable",
      title: "Ruang anggaran relatif longgar",
      body: "Estimasi cicilan dan cicilan lain berada di bawah 30% penghasilan yang Anda masukkan.",
    };
  }
  if (ratio <= 35) {
    return {
      tone: "review",
      title: "Perlu ditinjau bersama pengeluaran lain",
      body: "Pertimbangkan dana darurat dan pengeluaran rutin sebelum menentukan tenor.",
    };
  }
  return {
    tone: "careful",
    title: "Pertimbangkan DP lebih besar",
    body: "Anda dapat mencoba menaikkan DP atau menyesuaikan harga rumah untuk menurunkan rasio bulanan.",
  };
}

export default function KprCalculator({ asOfDate }) {
  const [effectiveDate, setEffectiveDate] = useState(asOfDate);
  useEffect(() => {
    const syncDate = () => setEffectiveDate(getJakartaDateKey());
    syncDate();
    const timer = window.setInterval(syncDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const activePrograms = useMemo(
    () =>
      mandiriKprPrograms.filter((program) =>
        isProgramActive(program, effectiveDate)
      ),
    [effectiveDate]
  );
  const [programId, setProgramId] = useState(activePrograms[0]?.id || "");
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [downPaymentInput, setDownPaymentInput] = useState({
    mode: "percent",
    value: 20,
  });
  const [tenorYears, setTenorYears] = useState(
    activePrograms[0]?.minTenorYears || 15
  );
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [otherInstallments, setOtherInstallments] = useState(0);

  const program =
    activePrograms.find((item) => item.id === programId) || activePrograms[0] || null;
  const downPayment =
    downPaymentInput.mode === "amount"
      ? downPaymentInput.value
      : Math.round(propertyPrice * (downPaymentInput.value / 100));
  const downPaymentPercent =
    downPaymentInput.mode === "amount"
      ? propertyPrice > 0
        ? (downPayment / propertyPrice) * 100
        : 0
      : downPaymentInput.value;

  const validation = useMemo(() => {
    if (!program) {
      return {
        isValid: false,
        errors: { program: "Rate Mandiri sedang diperbarui." },
        warnings: [],
      };
    }
    return validateKprInputs({
      propertyPrice,
      downPayment,
      tenorYears,
      program,
      asOfDate: effectiveDate,
    });
  }, [downPayment, effectiveDate, program, propertyPrice, tenorYears]);
  const validationMessages = Array.isArray(validation.errors)
    ? validation.errors
    : Object.values(validation.errors || {});
  const fieldErrors = Array.isArray(validation.errors)
    ? {}
    : validation.errors || {};

  const simulation = useMemo(() => {
    if (!validation.isValid || !program) return null;
    try {
      return calculateKprSimulation({
        propertyPrice,
        downPayment,
        tenorYears,
        program,
        asOfDate: effectiveDate,
      });
    } catch {
      return null;
    }
  }, [
    downPayment,
    effectiveDate,
    program,
    propertyPrice,
    tenorYears,
    validation.isValid,
  ]);

  const combinedMonthlyCommitment =
    (simulation?.firstMonthlyPayment || 0) + otherInstallments;
  const incomeRatio =
    monthlyIncome > 0 ? (combinedMonthlyCommitment / monthlyIncome) * 100 : null;
  const incomeInsight = ratioMessage(incomeRatio);

  const whatsappHref = useMemo(() => {
    if (!simulation) return "https://wa.me/6281931151888";
    const message = [
      "Halo Meka Asia, saya ingin konsultasi hasil simulasi KPR Mandiri.",
      `Harga rumah: ${formatCurrency(simulation.propertyPrice)}`,
      `DP: ${formatCurrency(simulation.downPayment)} (${decimalFormatter.format(
        simulation.downPaymentPercent
      )}%)`,
      `Tenor: ${simulation.tenorYears} tahun`,
      `Estimasi cicilan awal: ${formatCurrency(simulation.firstMonthlyPayment)}/bulan`,
      `Program: ${simulation.programLabel}`,
      "Mohon bantu jelaskan pilihan unit dan proses selanjutnya.",
    ].join("\n");
    return `https://wa.me/6281931151888?text=${encodeURIComponent(message)}`;
  }, [simulation]);

  const handlePriceChange = (event) => {
    setPropertyPrice(parseRupiahInput(event.target.value) ?? 0);
  };

  const handleDownPaymentAmountChange = (event) => {
    const amount = parseRupiahInput(event.target.value) ?? 0;
    setDownPaymentInput({ mode: "amount", value: amount });
  };

  const handleProgramChange = (event) => {
    const next = activePrograms.find((item) => item.id === event.target.value);
    setProgramId(event.target.value);
    if (next) {
      setTenorYears((current) =>
        Math.min(next.maxTenorYears, Math.max(next.minTenorYears, current))
      );
    }
  };

  return (
    <div className={styles.calculatorGrid}>
      <div className={styles.formPanel}>
        <div className={styles.panelHeading}>
          <span>01</span>
          <div>
            <h3 className="pf">Rencana pembelian</h3>
            <p>Masukkan angka yang paling mendekati rencana Anda.</p>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="kpr-property-price">Harga properti</label>
          <div className={styles.currencyField}>
            <span>Rp</span>
            <input
              id="kpr-property-price"
              name="propertyPrice"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={formatInputNumber(propertyPrice)}
              onChange={handlePriceChange}
              placeholder="750.000.000"
              aria-invalid={Boolean(fieldErrors.propertyPrice)}
              aria-describedby={`kpr-price-help${
                fieldErrors.propertyPrice ? " kpr-price-error" : ""
              }`}
            />
          </div>
          <p id="kpr-price-help" className={styles.helperText}>
            Gunakan harga unit dari tim Meka Asia atau masukkan estimasi sendiri.
          </p>
          {fieldErrors.propertyPrice ? (
            <p id="kpr-price-error" className={styles.errorText}>
              {fieldErrors.propertyPrice}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabelRow}>
            <label htmlFor="kpr-dp-percent">Uang muka (DP)</label>
            <strong>{decimalFormatter.format(downPaymentPercent)}%</strong>
          </div>
          <input
            id="kpr-dp-percent"
            className={styles.range}
            type="range"
            min="0"
            max="90"
            step="1"
            value={Math.round(Math.min(90, Math.max(0, downPaymentPercent)))}
            onChange={(event) =>
              setDownPaymentInput({
                mode: "percent",
                value: Number(event.target.value),
              })
            }
            aria-invalid={Boolean(fieldErrors.downPayment)}
            aria-describedby={
              fieldErrors.downPayment ? "kpr-dp-error" : undefined
            }
          />
          <div className={styles.dpInputs}>
            <div className={styles.currencyField}>
              <span>Rp</span>
              <input
                aria-label="Uang muka dalam Rupiah"
                type="text"
                inputMode="numeric"
                value={formatInputNumber(downPayment)}
                onChange={handleDownPaymentAmountChange}
                placeholder="150.000.000"
                aria-invalid={Boolean(fieldErrors.downPayment)}
                aria-describedby={
                  fieldErrors.downPayment ? "kpr-dp-error" : undefined
                }
              />
            </div>
            <div className={styles.percentField}>
              <input
                aria-label="Uang muka dalam persen"
                type="number"
                inputMode="decimal"
                min="0"
                max="99"
                step="1"
                value={Number(downPaymentPercent.toFixed(2))}
                onChange={(event) =>
                  setDownPaymentInput({
                    mode: "percent",
                    value: Number(event.target.value) || 0,
                  })
                }
                aria-invalid={Boolean(fieldErrors.downPayment)}
                aria-describedby={
                  fieldErrors.downPayment ? "kpr-dp-error" : undefined
                }
              />
              <span>%</span>
            </div>
          </div>
          {fieldErrors.downPayment ? (
            <p id="kpr-dp-error" className={styles.errorText}>
              {fieldErrors.downPayment}
            </p>
          ) : null}
        </div>

        <div className={styles.divider} />

        <div className={styles.panelHeading}>
          <span>02</span>
          <div>
            <h3 className="pf">Skema pembiayaan</h3>
            <p>Rate diambil dari halaman resmi Bank Mandiri.</p>
          </div>
        </div>

        {activePrograms.length ? (
          <>
            <div className={styles.fieldGroup}>
              <label htmlFor="kpr-program">Program Mandiri</label>
              <select
                id="kpr-program"
                value={program?.id || ""}
                onChange={handleProgramChange}
                className={styles.select}
                aria-invalid={Boolean(fieldErrors.program)}
                aria-describedby={
                  fieldErrors.program ? "kpr-program-error" : undefined
                }
              >
                {activePrograms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              {fieldErrors.program ? (
                <p id="kpr-program-error" className={styles.errorText}>
                  {fieldErrors.program}
                </p>
              ) : null}
            </div>

            <div className={styles.programCard}>
              <div>
                <span>Rate terverifikasi</span>
                <strong>
                  {program.tiers
                    .map((tier) => `${decimalFormatter.format(tier.annualRate)}%`)
                    .join(" · ")}
                </strong>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabelRow}>
                <label htmlFor="kpr-tenor">Jangka waktu</label>
                <strong>{tenorYears} tahun</strong>
              </div>
              <input
                id="kpr-tenor"
                className={styles.range}
                type="range"
                min={program.minTenorYears}
                max={program.maxTenorYears}
                step="1"
                value={tenorYears}
                onChange={(event) => setTenorYears(Number(event.target.value))}
                aria-invalid={Boolean(fieldErrors.tenorYears)}
                aria-describedby={
                  fieldErrors.tenorYears ? "kpr-tenor-error" : undefined
                }
              />
              <div className={styles.rangeLegend}>
                <span>{program.minTenorYears} tahun</span>
                <span>{program.maxTenorYears} tahun</span>
              </div>
              {fieldErrors.tenorYears ? (
                <p id="kpr-tenor-error" className={styles.errorText}>
                  {fieldErrors.tenorYears}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div className={styles.expiredState} role="status">
            <strong>Rate Mandiri sedang diperbarui</strong>
            <p>
              Program yang tersimpan sudah melewati masa berlaku. Hubungi tim Meka
              Asia untuk mendapatkan rate terbaru sebelum melakukan simulasi.
            </p>
          </div>
        )}

        <details className={styles.incomeDetails}>
          <summary>Cek ruang anggaran bulanan (opsional)</summary>
          <div className={styles.detailsBody}>
            <div className={styles.fieldGroup}>
              <label htmlFor="kpr-income">Penghasilan bulanan</label>
              <div className={styles.currencyField}>
                <span>Rp</span>
                <input
                  id="kpr-income"
                  type="text"
                  inputMode="numeric"
                  value={formatInputNumber(monthlyIncome)}
                  onChange={(event) =>
                    setMonthlyIncome(parseRupiahInput(event.target.value) ?? 0)
                  }
                  placeholder="20.000.000"
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="kpr-other-installments">Cicilan bulanan lain</label>
              <div className={styles.currencyField}>
                <span>Rp</span>
                <input
                  id="kpr-other-installments"
                  type="text"
                  inputMode="numeric"
                  value={formatInputNumber(otherInstallments)}
                  onChange={(event) =>
                    setOtherInstallments(
                      parseRupiahInput(event.target.value) ?? 0
                    )
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <p className={styles.privacyNote}>
              Angka ini hanya dihitung di browser dan tidak dikirim ke WhatsApp.
            </p>
          </div>
        </details>
      </div>

      <aside className={styles.resultColumn}>
        <div className={styles.resultPanel}>
          <span className={styles.resultEyebrow}>Estimasi cicilan awal</span>
          {simulation ? (
            <>
              <div role="status" aria-live="polite" aria-atomic="true">
                <p className={`${styles.resultAmount} pf`}>
                  {formatCurrency(simulation.firstMonthlyPayment)}
                </p>
                <span className={styles.perMonth}>per bulan</span>
              </div>

              <div className={styles.resultSummary}>
                <div>
                  <span>Pokok pinjaman</span>
                  <strong>{formatCurrency(simulation.principal)}</strong>
                </div>
                <div>
                  <span>Uang muka</span>
                  <strong>{formatCurrency(simulation.downPayment)}</strong>
                </div>
                <div>
                  <span>Tenor</span>
                  <strong>{simulation.tenorYears} tahun</strong>
                </div>
                <div>
                  <span>Dana awal minimum</span>
                  <strong>{formatCurrency(simulation.initialFunds)}</strong>
                </div>
              </div>

              <div className={styles.tierSection}>
                <div className={styles.tierHeading}>
                  <span>Perjalanan cicilan fixed</span>
                  <small>{simulation.knownFixedMonths} bulan terhitung</small>
                </div>
                <div className={styles.tierList}>
                  {simulation.tiers.map((tier) => (
                    <div className={styles.tierRow} key={`${tier.startMonth}-${tier.endMonth}`}>
                      <div>
                        <span>{tierPeriodLabel(tier)}</span>
                        <small>{decimalFormatter.format(tier.annualRate)}% efektif/tahun</small>
                      </div>
                      <strong>{formatCurrency(tier.monthlyPayment)}</strong>
                    </div>
                  ))}
                  {simulation.floating ? (
                    <div className={`${styles.tierRow} ${styles.floatingRow}`}>
                      <div>
                        <span>Setelah masa fixed</span>
                        <small>Mengikuti floating Bank Mandiri</small>
                      </div>
                      <strong>Belum dihitung</strong>
                    </div>
                  ) : null}
                </div>
              </div>

              <details className={styles.resultDetails}>
                <summary>Lihat rincian estimasi</summary>
                <div className={styles.resultDetailsBody}>
                  <div>
                    <span>Estimasi bunga selama rate diketahui</span>
                    <strong>{formatCurrency(simulation.totalKnownInterest)}</strong>
                  </div>
                  <div>
                    <span>Sisa pokok setelah masa fixed</span>
                    <strong>{formatCurrency(simulation.balanceAfterFixed)}</strong>
                  </div>
                  <p>
                    Dana awal minimum hanya mencakup DP dan angsuran pertama. Biaya
                    bank, notaris, asuransi, pajak, dan biaya lain belum termasuk.
                  </p>
                </div>
              </details>

              {incomeInsight ? (
                <div className={`${styles.incomeInsight} ${styles[incomeInsight.tone]}`}>
                  <span>Rasio komitmen bulanan</span>
                  <strong>{decimalFormatter.format(incomeRatio)}%</strong>
                  <h4>{incomeInsight.title}</h4>
                  <p>{incomeInsight.body}</p>
                  <small>Indikator perencanaan, bukan keputusan kredit.</small>
                </div>
              ) : null}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryCta}
              >
                Konsultasikan hasil
              </a>
            </>
          ) : (
            <div className={styles.resultEmpty}>
              <strong>Masukkan harga properti untuk memulai.</strong>
              <p>
                Estimasi cicilan, pokok pinjaman, dan jadwal bunga akan muncul di
                sini tanpa perlu reload halaman.
              </p>
              {validationMessages.length ? (
                <ul>
                  {validationMessages.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          <div className={styles.resultSource}>
            <p>
              Terakhir diverifikasi: {program ? formatDate(program.verifiedAt) : "—"}
            </p>
            <a
              href={
                program?.sourceUrl || "https://www.bankmandiri.co.id/in/kpr"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka sumber resmi Bank Mandiri
            </a>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <strong>Catatan penting</strong>
          <p>
            Simulasi ini hanya estimasi perencanaan dan bukan penawaran,
            persetujuan, atau keputusan kredit Bank Mandiri. Suku bunga, DP,
            cicilan, biaya, limit, tenor, serta kelayakan dapat berubah mengikuti
            analisis dan ketentuan Bank Mandiri.
          </p>
        </div>
      </aside>
    </div>
  );
}
