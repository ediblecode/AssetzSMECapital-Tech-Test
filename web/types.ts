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
  annualRate: number;
}

export interface RateTotal extends Rate {
  investmentTotal: number;
  annualInterest: number;
}

export interface Rates {
  bankOfEnglandRate: number;
  rates: RateTotal[];
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
