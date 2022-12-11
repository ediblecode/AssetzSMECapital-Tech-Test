import { type Holding } from "../../web/types";
import { HighestBalanceBonusPromotion } from "./HighestBalanceBonusPromotion";

const smallHolding: Holding = {
    balance: "100",
    id: 1,
    investmentAccount: "ABC",
    investorId: 1,
  },
  largeHolding: Holding = {
    balance: "200",
    id: 2,
    investmentAccount: "ABC",
    investorId: 1,
  };

const promotion = new HighestBalanceBonusPromotion();

describe("HighestBalanceBonusPromotion", () => {
  it("should not apply additional interest for holdings that arent the largest", () => {
    const promotion = new HighestBalanceBonusPromotion();
    expect(
      promotion.getAdditionalRate(smallHolding, [smallHolding, largeHolding])
    ).toBe(0);
  });

  it("should apply additional interest for the largest holdings", () => {
    const promotion = new HighestBalanceBonusPromotion();
    expect(
      promotion.getAdditionalRate(largeHolding, [smallHolding, largeHolding])
    ).toBe(1);
  });
});
