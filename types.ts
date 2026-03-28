
export enum InterestType {
  FIXED = 'FIXED',
  REDUCING = 'REDUCING'
}

export enum CalculationGoal {
  INSTALLMENT = 'INSTALLMENT',
  LOAN_AMOUNT = 'LOAN_AMOUNT'
}

export enum Language {
  EN = 'en',
  AR = 'ar'
}

export interface LoanInputs {
  principal: number | string;
  downPayment: number | string;
  downPaymentType?: 'amount' | 'percentage';
  interestRate: number | string;
  termMonths: number | string;
  interestType: InterestType;
  goal: CalculationGoal;
  targetInstallment: number | string;
  currency: string;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanResults {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationRow[];
}
