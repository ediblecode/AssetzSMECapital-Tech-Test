export interface Holding {
  id: number;
  investorId: number;
  investmentAccount: string;
  balance: string;
}

export interface Investor {
  id: number;
  name: string;
  riskLevel: number;
}

export interface Rate {
  id: number;
  investmentAccount: string;
  /** The original rate, before the BoE rate is added */
  annualRate: number;
}

export interface RateTotal extends Rate {
  /** The annual interest, including BoE added on top */
  totalAnnualRate: number;
  investmentTotal: number;
  annualInterest: number;
}

export interface RatesResponse {
  bankOfEnglandRate: number;
  rates: RateTotal[];
  investmentTotal: number;
  annualInterest: number;
}

export interface InvestorHolding {
  investor: Investor;
  holdings: Holding[];
  totalHolding: number;
  annualInterest: number;
}

export interface InvestorHoldingResponse {
  bankOfEnglandRate: number;
  minimumRiskLevel: number;
  maximumRiskLevel: number;
  minimumHolding: number;
  maximumHolding: number;
  investorHoldings: InvestorHolding[];
}
