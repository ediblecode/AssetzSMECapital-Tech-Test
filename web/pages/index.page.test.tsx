import Home, { type HomeProps } from "./index.page";
import { render } from "@testing-library/react";

const props: HomeProps = {
  investorHoldings: {
    bankOfEnglandRate: 1,
    maximumHolding: 100,
    minimumHolding: 50,
    maximumRiskLevel: 0.8,
    minimumRiskLevel: 0.1,
    investorHoldings: [
      {
        annualInterest: 15,
        totalHolding: 200,
        holdings: [],
        investor: {
          id: 1,
          name: "Investor 1",
          riskLevel: 0.2,
        },
      },
    ],
  },
  rates: {
    bankOfEnglandRate: 1,
    annualInterest: 200,
    investmentTotal: 2000,
    rates: [
      {
        annualRate: 1.5,
        id: 1,
        investmentAccount: "ABC",
        investmentTotal: 2000,
        totalAnnualRate: 2.5,
        annualInterest: 15,
      },
    ],
  },
  sort: "titleAsc",
};

describe("Home", () => {
  it("should match snapshot", () => {
    const { container } = render(<Home {...props} />);
    expect(container).toMatchSnapshot();
  });
});
