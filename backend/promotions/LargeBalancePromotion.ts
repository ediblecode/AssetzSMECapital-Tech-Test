import { injectable } from "inversify";
import { type Holding } from "../../web/types";
import { type IPromotion } from "../interfaces";

@injectable()
export class LargeBalancePromotion implements IPromotion {
  balanceThreshold: number = 1000;
  additionalInterest: number = 0.5;

  getAdditionalRate(holding: Holding, _holdings: Holding[]): number {
    return parseFloat(holding.balance) >= this.balanceThreshold
      ? this.additionalInterest
      : 0;
  }
}
