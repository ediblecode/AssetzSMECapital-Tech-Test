import { InvestorDailyTotal } from "./InvestorDailyTotal";

export interface IApp {
  getPortfolios(): Promise<InvestorDailyTotal[]>;
}
