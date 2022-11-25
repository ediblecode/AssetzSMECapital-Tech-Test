import {
  calculateInterest,
  displayCurrency,
  roundToTwoDecimalPlaces,
  summingReducer,
} from "./number";

describe("Number utils", () => {
  describe("calculateInterest", () => {
    it("should append BoE rate to calculate interest", () => {
      expect(calculateInterest(100, 1, 2)).toBe(3);
    });

    it("should parse string balance", () => {
      expect(calculateInterest("100", 1, 2)).toBe(3);
    });
  });

  describe("displayCurrency", () => {
    it("should round number to two decimal places as string", () => {
      // 0.1 + 0.2 = 0.30000000000000004 so test rounding
      expect(displayCurrency(0.1 + 0.2)).toBe("0.30");
    });
  });

  describe("roundToTwoDecimalPlaces", () => {
    it("should round number to two decimal places", () => {
      // 0.1 + 0.2 = 0.30000000000000004 so test rounding
      expect(roundToTwoDecimalPlaces(0.1 + 0.2)).toBe(0.3);
    });
  });

  describe("summingReducer", () => {
    it("should sum array of numbers", () => {
      expect([1, 2, 3, 4].reduce(summingReducer, 0)).toBe(10);
    });
  });
});
