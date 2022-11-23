export interface Holding {
  id: number;
  investorId: number;
  investmentAccount: string;
  balance: `${number}`;
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
