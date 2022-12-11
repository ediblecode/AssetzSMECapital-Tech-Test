import { injectable, multiInject } from "inversify";
import { Holding, Rate } from "../../web/types";
import { SERVICE_IDENTIFIER } from "../constants/identifiers";

import { type IInterestCalculator, type IPromotion } from "../interfaces";

function isLeapYear() {
  const year = new Date().getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

@injectable()
export class InterestCalculator implements IInterestCalculator {
  #promotions: IPromotion[];

  constructor(
    @multiInject(SERVICE_IDENTIFIER.PROMOTION) promotions: IPromotion[]
  ) {
    this.#promotions = promotions;
  }

  calculateAnnualInterest(
    holding: Holding,
    { annualRate }: Rate,
    additionalRate: number
  ): number {
    const daysInYear = isLeapYear() ? 366 : 365,
      balance = parseFloat(holding.balance);

    return (
      balance *
        Math.pow(
          1 + (annualRate + additionalRate) / 100 / daysInYear,
          daysInYear
        ) -
      balance
    );
  }

  calculateDailyInterest(
    holding: Holding,
    { annualRate }: Rate,
    additionalRate: number
  ): number {
    const daysInYear = isLeapYear() ? 366 : 365;

    return (
      (parseFloat(holding.balance) * ((annualRate + additionalRate) / 100)) /
      daysInYear
    );
  }

  calculateDailyTotal(holdings: Holding[], rates: Rate[]): number {
    return holdings.reduce((runningTotal, holding) => {
      const balance = parseFloat(holding.balance),
        rate = this.findRate(rates, holding),
        additionalPromotionRate = this.getAdditionalPromotionsRate(
          holding,
          holdings
        );

      return (
        runningTotal +
        balance +
        this.calculateDailyInterest(holding, rate, additionalPromotionRate)
      );
    }, 0);
  }

  calculateAnnualTotal(holdings: Holding[], rates: Rate[]): number {
    return holdings.reduce((runningTotal, holding) => {
      const balance = parseFloat(holding.balance),
        rate = this.findRate(rates, holding),
        additionalPromotionRate = this.getAdditionalPromotionsRate(
          holding,
          holdings
        );

      return (
        runningTotal +
        balance +
        this.calculateAnnualInterest(holding, rate, additionalPromotionRate)
      );
    }, 0);
  }

  private getAdditionalPromotionsRate(holding: Holding, holdings: Holding[]) {
    return this.#promotions.reduce(
      (runningTotal, promotion) =>
        // TODO: Is it safe to assume we add promotions here? Or maybe we should only take one (the largest)?
        runningTotal + promotion.getAdditionalRate(holding, holdings),
      0
    );
  }

  private findRate(rates: Rate[], holding: Holding) {
    return rates.find(
      (rate) => rate.investmentAccount === holding.investmentAccount
    ) as Rate;
  }
}
