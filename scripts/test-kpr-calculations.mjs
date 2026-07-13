import assert from "node:assert/strict";

import {
  amortizeBalance,
  calculateAnnuityPayment,
  calculateIncomeRatio,
  calculateKprSimulation,
  calculateRemainingBalance,
  parseRupiahInput,
  validateKprInputs,
} from "../lib/kprCalculations.js";
import {
  getActiveMandiriKprPrograms,
  isProgramActive,
  mandiriKprPrograms,
  toDateKey,
} from "../lib/mandiriKprPrograms.js";

const tests = [];
const asOfDate = "2026-07-13";
const program = mandiriKprPrograms[0];

function test(name, callback) {
  tests.push({ name, callback });
}

function assertNear(actual, expected, tolerance = 1, label = "nilai") {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: diharapkan ${expected} (+/- ${tolerance}), diterima ${actual}`,
  );
}

test("snapshot program Mandiri menggunakan rate dan sumber resmi yang diharapkan", () => {
  assert.equal(mandiriKprPrograms.length, 1);
  assert.equal(program.id, "mandiri-fixed-berjenjang-2026");
  assert.equal(program.verifiedAt, "2026-07-13");
  assert.equal(program.validUntil, "2026-07-31");
  assert.equal(program.minTenorYears, 10);
  assert.equal(program.maxTenorYears, 20);
  assert.deepEqual(program.tiers, [
    { months: 36, annualRate: 6.88 },
    { months: 36, annualRate: 8.88 },
    { months: 48, annualRate: 9.88 },
  ]);
  assert.equal(program.floatingRate, null);
  assert.equal(
    program.sourceUrl,
    "https://www.bankmandiri.co.id/en/kpr-bunga-fixed-berjenjang",
  );
});

test("expiry guard aktif sampai akhir validUntil dan berhenti sesudahnya", () => {
  assert.equal(isProgramActive(program, "2026-07-13"), true);
  assert.equal(isProgramActive(program, "2026-07-31"), true);
  assert.equal(isProgramActive(program, "2026-08-01"), false);
  assert.equal(isProgramActive(program, "tanggal-tidak-valid"), false);
  assert.equal(getActiveMandiriKprPrograms("2026-08-01").length, 0);
  assert.equal(toDateKey("2026-02-29"), null);
  assert.equal(toDateKey("2026-07-13T23:59:59+08:00"), "2026-07-13");
});

test("anuitas menangani bunga positif, nol, dan pokok nol", () => {
  assertNear(
    calculateAnnuityPayment(1_000_000_000, 6.88, 120),
    11_549_095.924666971,
    0.0001,
    "angsuran 6,88%",
  );
  assertNear(
    calculateAnnuityPayment(1_000_000_000, 0, 120),
    8_333_333.333333333,
    0.0001,
    "angsuran 0%",
  );
  assert.equal(calculateAnnuityPayment(0, 6.88, 120), 0);
  assert.throws(
    () => calculateAnnuityPayment(1_000_000, -1, 120),
    RangeError,
  );
});

test("saldo tersisa dan amortisasi segmen mempertahankan presisi", () => {
  const monthlyPayment = calculateAnnuityPayment(
    1_000_000_000,
    6.88,
    120,
  );
  const balance = calculateRemainingBalance({
    principal: 1_000_000_000,
    annualRate: 6.88,
    totalMonths: 120,
    paymentsMade: 36,
    monthlyPayment,
  });

  assertNear(balance, 768_194_050.8427677, 0.01, "saldo bulan ke-36");

  const segment = amortizeBalance({
    principal: 1_000_000_000,
    annualRate: 6.88,
    totalMonths: 120,
    monthsToAmortize: 36,
    monthlyPayment,
  });
  assertNear(segment.principalPaid, 231_805_949.15723228, 0.01);
  assertNear(segment.interestPaid, 183_961_504.13077867, 0.01);
  assertNear(
    segment.totalPaid,
    segment.principalPaid + segment.interestPaid,
    0.0001,
  );

  // A custom underpayment must not be reported as paid off at month 120.
  assert.ok(
    calculateRemainingBalance({
      principal: 1_000_000,
      annualRate: 6,
      totalMonths: 120,
      paymentsMade: 120,
      monthlyPayment: 0,
    }) > 1_000_000,
  );
});

test("fixture 1: tiga tier menyelesaikan tenor minimum 10 tahun", () => {
  const result = calculateKprSimulation({
    propertyPrice: 1_250_000_000,
    downPayment: 250_000_000,
    tenorYears: 10,
    program,
    asOfDate,
  });

  assert.equal(result.principal, 1_000_000_000);
  assert.equal(result.downPaymentPercent, 20);
  assert.equal(result.tenorMonths, 120);
  assert.equal(result.tiers.length, 3);
  assert.deepEqual(
    result.tiers.map(({ startMonth, endMonth }) => [startMonth, endMonth]),
    [
      [1, 36],
      [37, 72],
      [73, 120],
    ],
  );
  assertNear(result.tiers[0].monthlyPayment, 11_549_095.924666971, 0.01);
  assertNear(result.tiers[1].monthlyPayment, 12_312_802.320824506, 0.01);
  assertNear(result.tiers[2].monthlyPayment, 12_549_303.427265007, 0.01);
  assertNear(result.totalKnownInterest, 461_394_901.34641355, 1);
  assertNear(result.totalKnownPrincipal, 1_000_000_000, 1);
  assert.equal(result.balanceAfterFixed, 0);
  assert.equal(result.floatingMonths, 0);
  assert.equal(result.floating, null);
  assert.equal(result.isFullyCalculated, true);
  assertNear(
    result.initialFunds,
    250_000_000 + result.firstMonthlyPayment,
    0.0001,
  );
});

test("fixture 2: tenor 20 tahun berhenti menghitung saat floating tidak diketahui", () => {
  const result = calculateKprSimulation({
    propertyPrice: 1_250_000_000,
    downPayment: 250_000_000,
    tenorYears: 20,
    program,
    asOfDate,
  });

  assertNear(result.firstMonthlyPayment, 7_681_123.146166529, 0.01);
  assertNear(result.tiers[1].monthlyPayment, 8_775_729.038153129, 0.01);
  assertNear(result.tiers[2].monthlyPayment, 9_273_254.165626837, 0.01);
  assertNear(result.totalKnownInterest, 742_822_348.4977233, 1);
  assertNear(result.balanceAfterFixed, 705_259_469.9121275, 1);
  assert.equal(result.knownFixedMonths, 120);
  assert.equal(result.floatingMonths, 120);
  assert.deepEqual(
    {
      startMonth: result.floating.startMonth,
      endMonth: result.floating.endMonth,
      months: result.floating.months,
      annualRate: result.floating.annualRate,
      monthlyPayment: result.floating.monthlyPayment,
    },
    {
      startMonth: 121,
      endMonth: 240,
      months: 120,
      annualRate: null,
      monthlyPayment: null,
    },
  );
  assert.equal(result.isFullyCalculated, false);
});

test("fixture 3: tenor maksimum 20 tahun dan DP 0%", () => {
  const result = calculateKprSimulation({
    propertyPrice: 2_000_000_000,
    downPayment: 0,
    tenorYears: 20,
    program,
    asOfDate,
  });

  assertNear(result.firstMonthlyPayment, 15_362_246.292333057, 0.01);
  assertNear(result.totalKnownInterest, 1_485_644_696.9954467, 1);
  assertNear(result.balanceAfterFixed, 1_410_518_939.824255, 1);
  assert.equal(result.floatingMonths, 120);
  assert.equal(result.floating.monthlyPayment, null);
});

test("DP 90% tetap valid dan skala hasil proporsional", () => {
  const result = calculateKprSimulation({
    propertyPrice: 1_000_000_000,
    downPayment: 900_000_000,
    tenorYears: 10,
    program,
    asOfDate,
  });

  assert.equal(result.principal, 100_000_000);
  assert.equal(result.downPaymentPercent, 90);
  assertNear(result.firstMonthlyPayment, 1_154_909.592466697, 0.01);
  assert.equal(result.balanceAfterFixed, 0);
});

test("program single-rate dan rate 0% juga didukung oleh staged calculator", () => {
  const zeroRateProgram = {
    id: "fixture-zero",
    label: "Fixture 0%",
    minTenorYears: 1,
    maxTenorYears: 1,
    tiers: [{ months: 12, annualRate: 0 }],
    floatingRate: null,
    validUntil: "2099-12-31",
  };
  const result = calculateKprSimulation({
    propertyPrice: 120_000_000,
    downPayment: 0,
    tenorYears: 1,
    program: zeroRateProgram,
    asOfDate,
  });

  assert.equal(result.firstMonthlyPayment, 10_000_000);
  assert.equal(result.totalKnownInterest, 0);
  assert.equal(result.balanceAfterFixed, 0);
});

test("validasi mencakup input kosong, DP, tenor, pendapatan, dan expiry", () => {
  const empty = validateKprInputs();
  assert.equal(empty.isValid, false);
  assert.ok(empty.errors.propertyPrice);
  assert.ok(empty.errors.downPayment);
  assert.ok(empty.errors.tenorYears);
  assert.ok(empty.errors.program);

  const invalid = validateKprInputs({
    propertyPrice: 1_000_000_000,
    downPayment: 1_000_000_000,
    tenorYears: 9,
    program,
    asOfDate,
    monthlyIncome: 0,
    otherMonthlyInstallments: -1,
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.downPayment);
  assert.ok(invalid.errors.tenorYears);
  assert.ok(invalid.errors.monthlyIncome);
  assert.ok(invalid.errors.otherMonthlyInstallments);

  const aboveMaximumTenor = validateKprInputs({
    propertyPrice: 1_000_000_000,
    downPayment: 200_000_000,
    tenorYears: 21,
    program,
    asOfDate,
  });
  assert.match(aboveMaximumTenor.errors.tenorYears, /maksimum.*20 tahun/i);

  const expired = validateKprInputs({
    propertyPrice: 1_000_000_000,
    downPayment: 200_000_000,
    tenorYears: 10,
    program,
    asOfDate: "2026-08-01",
  });
  assert.match(expired.errors.program, /sedang diperbarui/i);
  assert.throws(
    () =>
      calculateKprSimulation({
        propertyPrice: 1_000_000_000,
        downPayment: 200_000_000,
        tenorYears: 10,
        program,
        asOfDate: "2026-08-01",
      }),
    RangeError,
  );

  const validWithWarning = validateKprInputs({
    propertyPrice: 1_000_000_000,
    downPayment: 200_000_000,
    tenorYears: 20,
    program,
    asOfDate,
  });
  assert.equal(validWithWarning.isValid, true);
  assert.equal(validWithWarning.warnings.length, 1);
});

test("paste nominal Rupiah dinormalisasi dengan aman", () => {
  assert.equal(parseRupiahInput("Rp 1.500.000.000"), 1_500_000_000);
  assert.equal(parseRupiahInput("1,500,000,000"), 1_500_000_000);
  assert.equal(parseRupiahInput("  Rp 750 000 000  "), 750_000_000);
  assert.equal(parseRupiahInput(""), null);
  assert.equal(parseRupiahInput("Rp saja"), null);
  assert.equal(parseRupiahInput("-100.000"), null);
});

test("rasio penghasilan bersifat numerik dan tidak membuat keputusan eligibility", () => {
  const ratio = calculateIncomeRatio({
    monthlyPayment: 8_000_000,
    monthlyIncome: 25_000_000,
    otherMonthlyInstallments: 2_000_000,
  });

  assert.equal(ratio.installmentRatio, 32);
  assert.equal(ratio.totalCommitmentRatio, 40);
  assert.equal(ratio.totalMonthlyCommitment, 10_000_000);
  assert.equal(calculateIncomeRatio(8_000_000, 0), null);
});

let passed = 0;

for (const { name, callback } of tests) {
  try {
    await callback();
    passed += 1;
    console.log(`ok ${passed} - ${name}`);
  } catch (error) {
    console.error(`not ok ${passed + 1} - ${name}`);
    throw error;
  }
}

console.log(`\n${passed} test KPR lulus.`);
