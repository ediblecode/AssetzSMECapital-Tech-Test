import { LargeBalancePromotion } from "./LargeBalancePromotion";

describe("LargeBalancePromotion", () => {
  const largeBalancePromotion = new LargeBalancePromotion();

  it("should add additional rate for balances over 1000", () => {
    expect(
      largeBalancePromotion.getAdditionalRate(
        {
          balance: "1234",
          id: 1,
          investmentAccount: "abc",
          investorId: 1,
        },
        []
      )
    ).toBe(0.5);
  });

  it("should not add additional rate for balances under 1000", () => {
    expect(
      largeBalancePromotion.getAdditionalRate(
        {
          balance: "999.99999999",
          id: 1,
          investmentAccount: "abc",
          investorId: 1,
        },
        []
      )
    ).toBe(0);
  });
});
