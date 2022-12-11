import { type Holding, type Rate } from "../../web/types";
import { container } from "../config/ioc.config";
import { SERVICE_IDENTIFIER } from "../constants/identifiers";
import { LargeBalancePromotion } from "../promotions/LargeBalancePromotion";
import { InterestCalculator } from "./InterestCalculator";

const holding: Holding = {
    balance: "1000",
    id: 1,
    investmentAccount: "ABC",
    investorId: 1,
  },
  rate: Rate = {
    annualRate: 5,
    id: 1,
    investmentAccount: "ABC",
  };

describe("InterestCalculator", () => {
  let interestCalculator: InterestCalculator;

  beforeEach(() => {
    interestCalculator = new InterestCalculator([
      // No promotions by default
    ]);
  });

  describe("calculateDailyInterest", () => {
    it.each([
      ["non-leap", 2022, (1000 * (5 / 100)) / 365],
      ["leap", 2024, (1000 * (5 / 100)) / 366],
    ])(
      "should calculate daily interest rate for %s year without additional rate",
      (_yearType, year, expectedDailyInterest) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyInterest = interestCalculator.calculateDailyInterest(
          holding,
          rate,
          0
        );

        expect(dailyInterest).toBe(expectedDailyInterest);

        jest.clearAllTimers();
      }
    );

    it.each([
      ["non-leap", 2022, 1, (1000 * ((5 + 1) / 100)) / 365],
      ["leap", 2024, 1, (1000 * ((5 + 1) / 100)) / 366],
    ])(
      "should calculate daily interest rate for %s year with additional rate",
      (_yearType, year, additionalRate, expectedDailyInterest) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyInterest = interestCalculator.calculateDailyInterest(
          holding,
          rate,
          additionalRate
        );

        expect(dailyInterest).toBe(expectedDailyInterest);
      }
    );
  });

  describe("calculateAnnualInterest", () => {
    it.each([
      ["non-leap", 2022, 1000 * Math.pow(1 + 5 / 100 / 365, 365) - 1000],
      ["leap", 2024, 1000 * Math.pow(1 + 5 / 100 / 366, 366) - 1000],
    ])(
      "should calculate annual interest rate for %s year without additional rate",
      (_yearType, year, expectedAnnualInterest) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const annualInterest = interestCalculator.calculateAnnualInterest(
          holding,
          rate,
          0
        );

        expect(annualInterest).toBe(expectedAnnualInterest);

        jest.clearAllTimers();
      }
    );

    it.each([
      [
        "non-leap",
        2022,
        1,
        1000 * Math.pow(1 + (5 + 1) / 100 / 365, 365) - 1000,
      ],
      ["leap", 2024, 1, 1000 * Math.pow(1 + (5 + 1) / 100 / 366, 366) - 1000],
    ])(
      "should calculate daily interest rate for %s year with additional rate",
      (_yearType, year, additionalRate, expectedAnnualInterest) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const annualInterest = interestCalculator.calculateAnnualInterest(
          holding,
          rate,
          additionalRate
        );

        expect(annualInterest).toBe(expectedAnnualInterest);
      }
    );
  });

  describe("calculateDailyTotal", () => {
    it.each([
      ["non-leap", 2022, (1000 * (5 / 100)) / 365 + 1000],
      ["leap", 2024, (1000 * (5 / 100)) / 366 + 1000],
    ])(
      "should calculate daily total with interest for %s year without promotions",
      (_yearType, year, expectedDailyTotal) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyTotal = interestCalculator.calculateDailyTotal(
          [holding],
          [rate]
        );

        expect(dailyTotal).toBe(expectedDailyTotal);

        jest.clearAllTimers();
      }
    );

    it.each([
      ["non-leap", 2022, (1000 * ((5 + 1) / 100)) / 365 + 1000],
      ["leap", 2024, (1000 * ((5 + 1) / 100)) / 366 + 1000],
    ])(
      "should calculate daily total with interest for %s year with large balance promotion",
      (_yearType, year, expectedDailyTotal) => {
        const largeBalancePromotion = new LargeBalancePromotion();
        largeBalancePromotion.balanceThreshold = 100;
        largeBalancePromotion.additionalInterest = 1;

        interestCalculator = new InterestCalculator([largeBalancePromotion]);

        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyTotal = interestCalculator.calculateDailyTotal(
          [holding],
          [rate]
        );

        expect(dailyTotal).toBe(expectedDailyTotal);

        jest.clearAllTimers();
      }
    );

    it.todo("should apply multiple promotions");
  });

  describe("calculateAnnualTotal", () => {
    it.each([
      ["non-leap", 2022, 1000 * Math.pow(1 + 5 / 100 / 365, 365)],
      ["leap", 2024, 1000 * Math.pow(1 + 5 / 100 / 366, 366)],
    ])(
      "should calculate annual total with interest for %s year without promotions",
      (_yearType, year, expectedDailyTotal) => {
        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyTotal = interestCalculator.calculateAnnualTotal(
          [holding],
          [rate]
        );

        expect(dailyTotal).toBe(expectedDailyTotal);

        jest.clearAllTimers();
      }
    );

    it.each([
      ["non-leap", 2022, 1000 * Math.pow(1 + (5 + 1) / 100 / 365, 365)],
      ["leap", 2024, 1000 * Math.pow(1 + (5 + 1) / 100 / 366, 366)],
    ])(
      "should calculate annual total with interest for %s year with large balance promotion",
      (_yearType, year, expectedDailyTotal) => {
        const largeBalancePromotion = new LargeBalancePromotion();
        largeBalancePromotion.balanceThreshold = 100;
        largeBalancePromotion.additionalInterest = 1;

        interestCalculator = new InterestCalculator([largeBalancePromotion]);

        jest.useFakeTimers().setSystemTime(new Date(year, 0, 1));

        const dailyTotal = interestCalculator.calculateAnnualTotal(
          [holding],
          [rate]
        );

        expect(dailyTotal).toBe(expectedDailyTotal);

        jest.clearAllTimers();
      }
    );
  });
});
