import { Holding, Rate } from "../../web/types";

export interface IInterestCalculator {
  calculateDailyInterest(
    holding: Holding,
    rate: Rate,
    additionalRate?: number
  ): number;

  calculateAnnualInterest(
    holding: Holding,
    rate: Rate,
    additionalRate?: number
  ): number;

  calculateDailyTotal(holdings: Holding[], rates: Rate[]): number;

  calculateAnnualTotal(holdings: Holding[], rates: Rate[]): number;
}
