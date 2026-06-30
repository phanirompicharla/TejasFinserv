export interface CalcResult {
  invested: number
  returns: number
  total: number
  extra: Record<string, string | number>
}

function baseResult(invested: number, total: number, extra: Record<string, string | number> = {}): CalcResult {
  return { invested, total, returns: total - invested, extra }
}

export function calcSip(monthly: number, annualReturn: number, years: number): CalcResult {
  const i = annualReturn / 12 / 100
  const n = years * 12
  const invested = monthly * n
  const total =
    i === 0 ? invested : monthly * (((Math.pow(1 + i, n) - 1) / i) * (1 + i))
  return baseResult(invested, total)
}

export function calcLumpsum(amount: number, annualReturn: number, years: number): CalcResult {
  const r = annualReturn / 100
  const total = amount * Math.pow(1 + r, years)
  return baseResult(amount, total)
}

export function calcStepUpSip(
  monthly: number,
  stepUpPct: number,
  annualReturn: number,
  years: number
): CalcResult {
  const monthlyRate = annualReturn / 12 / 100
  let balance = 0
  let invested = 0
  let currentMonthly = monthly

  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + currentMonthly) * (1 + monthlyRate)
      invested += currentMonthly
    }
    currentMonthly *= 1 + stepUpPct / 100
  }
  return baseResult(invested, balance)
}

export function calcGoalSip(target: number, annualReturn: number, years: number): CalcResult {
  const i = annualReturn / 12 / 100
  const n = years * 12
  const monthly =
    i === 0 ? target / n : (target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i))
  const invested = monthly * n
  return baseResult(invested, target, { monthlySip: Math.round(monthly) })
}

export function calcSwp(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  years: number
): CalcResult {
  const monthlyRate = annualReturn / 12 / 100
  let balance = corpus
  let monthsLasted = 0
  const maxMonths = years * 12

  for (let m = 0; m < maxMonths; m++) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal
    if (balance < 0) break
    monthsLasted++
  }

  const totalWithdrawn = monthlyWithdrawal * monthsLasted
  return {
    invested: corpus,
    total: Math.max(0, Math.round(balance)),
    returns: totalWithdrawn - corpus,
    extra: {
      monthsLasted,
      yearsLasted: (monthsLasted / 12).toFixed(1),
      totalWithdrawn: Math.round(totalWithdrawn),
    },
  }
}

export function calcRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyExpense: number,
  inflation: number,
  preRetReturn: number,
  postRetReturn: number,
  lifeExpectancy: number
): CalcResult {
  const yearsToRetire = retirementAge - currentAge
  const retirementYears = lifeExpectancy - retirementAge
  const inflRate = inflation / 100
  const monthlyExpenseAtRetirement = monthlyExpense * Math.pow(1 + inflRate, yearsToRetire)
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12

  const postRate = postRetReturn / 100
  const corpusRequired =
    postRate === 0
      ? annualExpenseAtRetirement * retirementYears
      : annualExpenseAtRetirement *
        ((1 - Math.pow(1 + postRate, -retirementYears)) / postRate)

  const preRate = preRetReturn / 12 / 100
  const months = yearsToRetire * 12
  const monthlySip =
    preRate === 0
      ? corpusRequired / months
      : (corpusRequired * preRate) / ((Math.pow(1 + preRate, months) - 1) * (1 + preRate))

  const invested = monthlySip * months
  return baseResult(invested, corpusRequired, {
    monthlySip: Math.round(monthlySip),
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    retirementYears,
  })
}

export function calcEmi(principal: number, annualRate: number, years: number): CalcResult {
  const r = annualRate / 12 / 100
  const n = years * 12
  const emi =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const total = emi * n
  return baseResult(principal, total, {
    emi: Math.round(emi),
    totalInterest: Math.round(total - principal),
  })
}

export function calcLumpsumVsSip(
  monthly: number,
  annualReturn: number,
  years: number
): CalcResult {
  const sip = calcSip(monthly, annualReturn, years)
  const totalInvested = monthly * years * 12
  const lumpsum = calcLumpsum(totalInvested, annualReturn, years)
  return {
    invested: totalInvested,
    total: sip.total,
    returns: sip.returns,
    extra: {
      sipTotal: Math.round(sip.total),
      lumpsumTotal: Math.round(lumpsum.total),
      difference: Math.round(sip.total - lumpsum.total),
    },
  }
}

export function calcCagr(begin: number, end: number, years: number): CalcResult {
  const cagr = years === 0 || begin === 0 ? 0 : (Math.pow(end / begin, 1 / years) - 1) * 100
  return baseResult(begin, end, { cagr: cagr.toFixed(2) })
}

export function calcInflation(presentCost: number, inflation: number, years: number): CalcResult {
  const future = presentCost * Math.pow(1 + inflation / 100, years)
  return baseResult(presentCost, future)
}

export function calcChildEducation(
  currentCost: number,
  inflation: number,
  years: number,
  annualReturn: number
): CalcResult {
  const futureCost = currentCost * Math.pow(1 + inflation / 100, years)
  const sip = calcGoalSip(futureCost, annualReturn, years)
  return baseResult(sip.invested, futureCost, {
    futureCost: Math.round(futureCost),
    monthlySip: sip.extra.monthlySip,
  })
}

export function calcFd(principal: number, annualRate: number, years: number, compounding = 4): CalcResult {
  const r = annualRate / 100
  const n = compounding
  const t = years
  const total = principal * Math.pow(1 + r / n, n * t)
  return baseResult(principal, total)
}

export function calcRd(monthly: number, annualRate: number, years: number): CalcResult {
  const i = annualRate / 400
  const n = years * 12
  const invested = monthly * n
  const total =
    i === 0
      ? invested
      : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
  return baseResult(invested, total)
}

export function calcPpf(annual: number, annualRate: number, years = 15): CalcResult {
  let balance = 0
  const r = annualRate / 100
  for (let y = 0; y < years; y++) {
    balance = (balance + annual) * (1 + r)
  }
  return baseResult(annual * years, balance)
}

export function calcElss(annual: number, annualReturn: number, years: number): CalcResult {
  let balance = 0
  const r = annualReturn / 100
  for (let y = 0; y < years; y++) {
    balance = (balance + annual) * (1 + r)
  }
  const taxSaved = Math.min(annual * years, 150000 * years) * 0.3
  return baseResult(annual * years, balance, { taxSaved: Math.round(taxSaved) })
}

export function calcNps(monthly: number, annualReturn: number, years: number): CalcResult {
  return calcSip(monthly, annualReturn, years)
}

export function calcSukanya(annual: number, annualRate: number, years: number): CalcResult {
  return calcPpf(annual, annualRate, years)
}

export function calcIncomeTax(annualIncome: number, regime: 'old' | 'new'): CalcResult {
  let tax = 0
  if (regime === 'new') {
    if (annualIncome > 300000) tax += Math.min(annualIncome - 300000, 300000) * 0.05
    if (annualIncome > 600000) tax += Math.min(annualIncome - 600000, 300000) * 0.1
    if (annualIncome > 900000) tax += Math.min(annualIncome - 900000, 300000) * 0.15
    if (annualIncome > 1200000) tax += Math.min(annualIncome - 1200000, 300000) * 0.2
    if (annualIncome > 1500000) tax += (annualIncome - 1500000) * 0.3
    if (annualIncome <= 700000) tax = 0
  } else {
    if (annualIncome > 250000) tax += Math.min(annualIncome - 250000, 250000) * 0.05
    if (annualIncome > 500000) tax += Math.min(annualIncome - 500000, 500000) * 0.2
    if (annualIncome > 1000000) tax += (annualIncome - 1000000) * 0.3
    if (annualIncome <= 500000) tax = 0
  }
  tax *= 1.04
  return baseResult(annualIncome, annualIncome - tax, { tax: Math.round(tax) })
}
