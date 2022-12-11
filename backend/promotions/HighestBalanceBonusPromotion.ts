import { injectable } from "inversify";
import { type Holding } from "../../web/types";
import { type IPromotion } from "../interfaces";

@injectable()
export class HighestBalanceBonusPromotion implements IPromotion {
  additionalInterest: number = 1;

  getAdditionalRate(holding: Holding, holdings: Holding[]): number {
    const biggestHolding = holdings.reduce(function (prev, current) {
      return parseFloat(prev.balance) > parseFloat(current.balance)
        ? prev
        : current;
    });

    return holding.id === biggestHolding.id ? this.additionalInterest : 0;
  }
}
