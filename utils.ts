
import { LoanInputs, LoanResults, InterestType, CalculationGoal, AmortizationRow, Language } from './types';

export const formatCurrency = (value: number, lang: Language = Language.EN) => {
  return new Intl.NumberFormat(lang === Language.AR ? 'ar-SA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(value);
};

export const calculateLoan = (rawInputs: LoanInputs): LoanResults => {
  const inputs = {
    ...rawInputs,
    principal: Number(rawInputs.principal) || 0,
    downPayment: Number(rawInputs.downPayment) || 0,
    interestRate: Number(rawInputs.interestRate) || 0,
    termMonths: Number(rawInputs.termMonths) || 0,
    targetInstallment: Number(rawInputs.targetInstallment) || 0,
  };

  const { 
    interestRate, termMonths, interestType, goal, targetInstallment, downPayment, downPaymentType
  } = inputs;
  const monthlyRate = interestRate / 100 / 12;

  let principal = inputs.principal;
  let monthlyPayment = 0;

  if (goal === CalculationGoal.LOAN_AMOUNT) {
    if (interestType === InterestType.REDUCING) {
      principal = monthlyRate > 0 
        ? (targetInstallment / monthlyRate) * (1 - Math.pow(1 + monthlyRate, -termMonths))
        : targetInstallment * termMonths;
    } else {
      const yearlyRate = interestRate / 100;
      const years = termMonths / 12;
      principal = (targetInstallment * termMonths) / (1 + (yearlyRate * years));
    }
    monthlyPayment = targetInstallment;
  } else {
    let actualDownPayment = 0;
    if (downPaymentType === 'percentage') {
      actualDownPayment = (principal * downPayment) / 100;
    } else {
      actualDownPayment = downPayment;
    }
    principal = Math.max(0, principal - actualDownPayment);

    if (interestType === InterestType.REDUCING) {
      monthlyPayment = monthlyRate > 0 
        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
        : principal / termMonths;
    } else {
      const totalInterest = principal * (interestRate / 100) * (termMonths / 12);
      monthlyPayment = (principal + totalInterest) / termMonths;
    }
  }

  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterestAccumulated = 0;

  for (let m = 1; m <= termMonths; m++) {
    let interestPortion = 0;
    let principalPortion = 0;

    if (interestType === InterestType.REDUCING) {
      interestPortion = currentBalance * monthlyRate;
      principalPortion = monthlyPayment - interestPortion;
    } else {
      interestPortion = (principal * (interestRate / 100) * (termMonths / 12)) / termMonths;
      principalPortion = monthlyPayment - interestPortion;
    }

    currentBalance -= principalPortion;
    if (currentBalance < 0) currentBalance = 0;
    
    totalInterestAccumulated += interestPortion;

    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalPortion,
      interest: interestPortion,
      remainingBalance: currentBalance
    });
  }

  return {
    monthlyPayment,
    totalPrincipal: principal,
    totalInterest: totalInterestAccumulated,
    totalPayment: principal + totalInterestAccumulated,
    amortizationSchedule: schedule
  };
};
