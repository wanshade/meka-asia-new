import { isProgramActive } from "./mandiriKprPrograms.js";

// Convenience re-export for calculator clients that keep all KPR helpers in
// one import statement.
export { isProgramActive };

const MONTHS_PER_YEAR = 12;
const PERCENT_DIVISOR = 100;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function assertNonNegativeNumber(value, name) {
  if (!isFiniteNumber(value) || value < 0) {
    throw new RangeError(`${name} harus berupa angka nol atau lebih.`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} harus berupa bilangan bulat positif.`);
  }
}

function assertProgramShape(program) {
  if (!program || typeof program !== "object") {
    throw new TypeError("Program KPR wajib dipilih.");
  }

  if (!Array.isArray(program.tiers) || program.tiers.length === 0) {
    throw new TypeError("Program KPR harus memiliki sedikitnya satu tier bunga.");
  }

  program.tiers.forEach((tier, index) => {
    assertPositiveInteger(tier?.months, `Durasi tier ${index + 1}`);
    assertNonNegativeNumber(tier?.annualRate, `Bunga tier ${index + 1}`);
  });
}

/**
 * Effective monthly annuity payment.
 *
 * annualRate is expressed as a percentage (for example, 6.88 means 6.88%).
 * No currency rounding is performed here; presentation code owns rounding.
 */
export function calculateAnnuityPayment(principal, annualRate, months) {
  assertNonNegativeNumber(principal, "Pokok pinjaman");
  assertNonNegativeNumber(annualRate, "Suku bunga tahunan");
  assertPositiveInteger(months, "Tenor bulan");

  if (principal === 0) return 0;

  const monthlyRate = annualRate / MONTHS_PER_YEAR / PERCENT_DIVISOR;
  if (monthlyRate === 0) return principal / months;

  // This equivalent form is numerically stable for long tenors.
  return principal * (monthlyRate / (1 - (1 + monthlyRate) ** -months));
}

/**
 * Outstanding principal after a number of equal monthly payments.
 */
export function calculateRemainingBalance({
  principal,
  annualRate,
  totalMonths,
  paymentsMade,
  monthlyPayment = calculateAnnuityPayment(
    principal,
    annualRate,
    totalMonths,
  ),
}) {
  assertNonNegativeNumber(principal, "Pokok pinjaman");
  assertNonNegativeNumber(annualRate, "Suku bunga tahunan");
  assertPositiveInteger(totalMonths, "Tenor bulan");
  assertNonNegativeNumber(monthlyPayment, "Angsuran bulanan");

  if (!Number.isInteger(paymentsMade) || paymentsMade < 0) {
    throw new RangeError("Jumlah pembayaran harus berupa bilangan bulat nol atau lebih.");
  }

  if (paymentsMade > totalMonths) {
    throw new RangeError("Jumlah pembayaran tidak boleh melebihi tenor.");
  }

  if (principal === 0) return 0;
  if (paymentsMade === 0) return principal;

  const monthlyRate = annualRate / MONTHS_PER_YEAR / PERCENT_DIVISOR;
  let balance;

  if (monthlyRate === 0) {
    balance = principal - monthlyPayment * paymentsMade;
  } else {
    const growth = (1 + monthlyRate) ** paymentsMade;
    balance =
      principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);
  }

  const formulaTolerance = Math.max(
    1e-7,
    principal * Number.EPSILON * totalMonths * 10,
  );

  // Formula noise must not surface as a tiny or negative remaining balance.
  return Math.abs(balance) <= formulaTolerance ? 0 : Math.max(0, balance);
}

/**
 * Amortises a segment while retaining full internal precision.
 */
export function amortizeBalance({
  principal,
  annualRate,
  totalMonths,
  monthsToAmortize,
  monthlyPayment = calculateAnnuityPayment(
    principal,
    annualRate,
    totalMonths,
  ),
}) {
  assertPositiveInteger(monthsToAmortize, "Jumlah bulan amortisasi");

  if (monthsToAmortize > totalMonths) {
    throw new RangeError("Periode amortisasi tidak boleh melebihi sisa tenor.");
  }

  const closingBalance = calculateRemainingBalance({
    principal,
    annualRate,
    totalMonths,
    paymentsMade: monthsToAmortize,
    monthlyPayment,
  });
  const principalPaid = principal - closingBalance;
  const totalPaid = monthlyPayment * monthsToAmortize;
  const interestPaid = totalPaid - principalPaid;

  return {
    openingBalance: principal,
    annualRate,
    totalMonths,
    months: monthsToAmortize,
    monthlyPayment,
    totalPaid,
    principalPaid,
    interestPaid,
    closingBalance,
  };
}

/**
 * Safely normalises a pasted Rupiah value such as "Rp 1.500.000.000".
 * Returns null for empty or unusable input so UI code can distinguish it from 0.
 */
export function parseRupiahInput(value) {
  if (isFiniteNumber(value)) return value >= 0 ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  if (value.includes("-")) return null;

  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;

  const parsed = Number(digits);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

/**
 * A neutral planning ratio. This deliberately makes no eligibility judgement.
 */
export function calculateIncomeRatio(
  monthlyPaymentOrOptions,
  incomeArgument,
  otherInstallmentsArgument = 0,
) {
  const options =
    typeof monthlyPaymentOrOptions === "object" &&
    monthlyPaymentOrOptions !== null
      ? monthlyPaymentOrOptions
      : {
          monthlyPayment: monthlyPaymentOrOptions,
          monthlyIncome: incomeArgument,
          otherMonthlyInstallments: otherInstallmentsArgument,
        };

  const monthlyPayment = options.monthlyPayment;
  const monthlyIncome = options.monthlyIncome;
  const otherMonthlyInstallments = options.otherMonthlyInstallments ?? 0;

  if (!isFiniteNumber(monthlyIncome) || monthlyIncome <= 0) return null;
  if (
    !isFiniteNumber(monthlyPayment) ||
    monthlyPayment < 0 ||
    !isFiniteNumber(otherMonthlyInstallments) ||
    otherMonthlyInstallments < 0
  ) {
    return null;
  }

  const totalMonthlyCommitment = monthlyPayment + otherMonthlyInstallments;

  return {
    monthlyPayment,
    monthlyIncome,
    otherMonthlyInstallments,
    totalMonthlyCommitment,
    installmentRatio: (monthlyPayment / monthlyIncome) * 100,
    totalCommitmentRatio: (totalMonthlyCommitment / monthlyIncome) * 100,
  };
}

/**
 * Validates user-facing simulator values without throwing.
 */
export function validateKprInputs({
  propertyPrice,
  downPayment,
  tenorYears,
  program,
  asOfDate = new Date(),
  monthlyIncome,
  otherMonthlyInstallments,
} = {}) {
  const errors = {};
  const warnings = [];

  if (!isFiniteNumber(propertyPrice) || propertyPrice <= 0) {
    errors.propertyPrice = "Masukkan harga properti lebih dari Rp0.";
  }

  if (!isFiniteNumber(downPayment) || downPayment < 0) {
    errors.downPayment = "Uang muka harus berupa angka nol atau lebih.";
  } else if (isFiniteNumber(propertyPrice) && downPayment >= propertyPrice) {
    errors.downPayment = "Uang muka harus lebih kecil dari harga properti.";
  }

  if (!program || typeof program !== "object") {
    errors.program = "Pilih program KPR Bank Mandiri.";
  } else {
    try {
      assertProgramShape(program);
    } catch (error) {
      errors.program = error.message;
    }

    if (!errors.program && !isProgramActive(program, asOfDate)) {
      errors.program =
        "Rate program sedang diperbarui. Silakan konsultasikan rate terbaru.";
    }
  }

  if (!Number.isInteger(tenorYears) || tenorYears <= 0) {
    errors.tenorYears = "Pilih tenor dalam tahun penuh.";
  } else if (program && typeof program === "object") {
    if (
      isFiniteNumber(program.minTenorYears) &&
      tenorYears < program.minTenorYears
    ) {
      errors.tenorYears = `Tenor minimum program ini ${program.minTenorYears} tahun.`;
    } else if (
      isFiniteNumber(program.maxTenorYears) &&
      tenorYears > program.maxTenorYears
    ) {
      errors.tenorYears = `Tenor maksimum program ini ${program.maxTenorYears} tahun.`;
    }
  }

  if (
    monthlyIncome !== undefined &&
    (!isFiniteNumber(monthlyIncome) || monthlyIncome <= 0)
  ) {
    errors.monthlyIncome = "Penghasilan bulanan harus lebih dari Rp0.";
  }

  if (
    otherMonthlyInstallments !== undefined &&
    (!isFiniteNumber(otherMonthlyInstallments) ||
      otherMonthlyInstallments < 0)
  ) {
    errors.otherMonthlyInstallments =
      "Cicilan lain harus berupa angka nol atau lebih.";
  }

  if (
    !errors.program &&
    program?.floatingRate == null &&
    Number.isInteger(tenorYears)
  ) {
    const fixedMonths = program.tiers.reduce(
      (sum, tier) => sum + tier.months,
      0,
    );
    if (tenorYears * MONTHS_PER_YEAR > fixedMonths) {
      warnings.push(
        "Cicilan setelah periode fixed mengikuti bunga floating Bank Mandiri dan tidak dihitung.",
      );
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    fieldErrors: errors,
    warnings,
  };
}

/**
 * Calculates a fixed-tier KPR. Every tier recalculates its payment using the
 * outstanding balance and the complete remaining tenor. If floatingRate is
 * unknown, no payment is invented for that portion of the loan.
 */
export function calculateKprSimulation({
  propertyPrice,
  downPayment,
  tenorYears,
  program,
  asOfDate = new Date(),
}) {
  const validation = validateKprInputs({
    propertyPrice,
    downPayment,
    tenorYears,
    program,
    asOfDate,
  });

  if (!validation.isValid) {
    const error = new RangeError(Object.values(validation.errors)[0]);
    error.validation = validation;
    throw error;
  }

  const principal = propertyPrice - downPayment;
  const tenorMonths = tenorYears * MONTHS_PER_YEAR;
  const tiers = [];
  let elapsedMonths = 0;
  let balance = principal;
  let totalKnownInterest = 0;
  let totalKnownPrincipal = 0;

  for (const configuredTier of program.tiers) {
    const remainingMonths = tenorMonths - elapsedMonths;
    if (remainingMonths <= 0 || balance <= 0) break;

    const tierMonths = Math.min(configuredTier.months, remainingMonths);
    const monthlyPayment = calculateAnnuityPayment(
      balance,
      configuredTier.annualRate,
      remainingMonths,
    );
    const amortization = amortizeBalance({
      principal: balance,
      annualRate: configuredTier.annualRate,
      totalMonths: remainingMonths,
      monthsToAmortize: tierMonths,
      monthlyPayment,
    });

    const tier = {
      index: tiers.length + 1,
      startMonth: elapsedMonths + 1,
      endMonth: elapsedMonths + tierMonths,
      months: tierMonths,
      annualRate: configuredTier.annualRate,
      openingBalance: balance,
      monthlyPayment,
      principalPaid: amortization.principalPaid,
      interestPaid: amortization.interestPaid,
      closingBalance: amortization.closingBalance,
    };

    tiers.push(tier);
    totalKnownInterest += tier.interestPaid;
    totalKnownPrincipal += tier.principalPaid;
    elapsedMonths += tierMonths;
    balance = tier.closingBalance;
  }

  const knownFixedMonths = elapsedMonths;
  const floatingMonths = Math.max(0, tenorMonths - knownFixedMonths);
  const balanceAfterFixed = balance;
  let floating = null;

  if (floatingMonths > 0) {
    floating = {
      startMonth: knownFixedMonths + 1,
      endMonth: tenorMonths,
      months: floatingMonths,
      annualRate: null,
      monthlyPayment: null,
      openingBalance: balanceAfterFixed,
    };

    if (isFiniteNumber(program.floatingRate)) {
      const monthlyPayment = calculateAnnuityPayment(
        balanceAfterFixed,
        program.floatingRate,
        floatingMonths,
      );
      const amortization = amortizeBalance({
        principal: balanceAfterFixed,
        annualRate: program.floatingRate,
        totalMonths: floatingMonths,
        monthsToAmortize: floatingMonths,
        monthlyPayment,
      });

      floating = {
        ...floating,
        annualRate: program.floatingRate,
        monthlyPayment,
        principalPaid: amortization.principalPaid,
        interestPaid: amortization.interestPaid,
        closingBalance: amortization.closingBalance,
      };
    }
  }

  const firstMonthlyPayment = tiers[0]?.monthlyPayment ?? 0;

  return {
    propertyPrice,
    downPayment,
    downPaymentPercent: (downPayment / propertyPrice) * 100,
    principal,
    tenorYears,
    tenorMonths,
    programId: program.id,
    programLabel: program.label,
    monthlyPayment: firstMonthlyPayment,
    firstMonthlyPayment,
    knownFixedMonths,
    floatingMonths,
    totalKnownInterest,
    totalKnownPrincipal,
    totalKnownPayments: totalKnownInterest + totalKnownPrincipal,
    balanceAfterFixed,
    initialFunds: downPayment + firstMonthlyPayment,
    tiers,
    fixedTiers: tiers,
    rateSchedule: tiers,
    floating,
    isFullyCalculated:
      floatingMonths === 0 || isFiniteNumber(program.floatingRate),
  };
}

export const calculateMonthlyPayment = calculateAnnuityPayment;
export const calculateLoanBalance = calculateRemainingBalance;
export const calculateStagedKpr = calculateKprSimulation;
export const calculateTieredKpr = calculateKprSimulation;
