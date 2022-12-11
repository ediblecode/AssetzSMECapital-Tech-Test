import { injectable, inject } from "inversify";
import { SERVICE_IDENTIFIER } from "../constants/identifiers";

import {
  type IDataLoader,
  type IInterestCalculator,
  type IApp,
} from "../interfaces";
import { InvestorDailyTotal } from "../interfaces/InvestorDailyTotal";

@injectable()
export class App implements IApp {
  #dataLoader: IDataLoader;
  #interestCalculator: IInterestCalculator;

  public constructor(
    @inject(SERVICE_IDENTIFIER.DATA_LOADER) dataLoader: IDataLoader,
    @inject(SERVICE_IDENTIFIER.INTEREST_CALCULATOR)
    interestCalculator: IInterestCalculator
  ) {
    this.#dataLoader = dataLoader;
    this.#interestCalculator = interestCalculator;
  }

  async getPortfolios(): Promise<InvestorDailyTotal[]> {
    const [rates, allHoldings] = await Promise.all([
        this.#dataLoader.getRates(),
        this.#dataLoader.getHoldings(),
      ]),
      investorIds = [...new Set(allHoldings.map((h) => h.investorId))];

    return investorIds.map((investorId) => {
      const holdings = allHoldings.filter((h) => h.investorId === investorId);

      return {
        investorId,
        totalValue: holdings.reduce(
          (sum, holding) => (sum += parseFloat(holding.balance)),
          0
        ),
        totalDailyPortfolioValue: this.#interestCalculator.calculateDailyTotal(
          holdings,
          rates.rates
        ),
        totalAnnualPortfolioValue:
          this.#interestCalculator.calculateAnnualTotal(holdings, rates.rates),
      };
    });
  }
}
