import Home, { type HomeProps } from "./index.page";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";

const useRouterMock = jest.mocked(useRouter);

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

  it.each([
    ["Please select", ""],
    ["Investor total (high to low)", "totalAsc"],
    ["Investor total (low to high)", "totalDesc"],
    ["Investor name (A to Z)", "nameAsc"],
    ["Investor name (Z to A)", "nameDesc"],
  ])(
    "should update URL when sort order is changed to %s",
    async (optionLabel, expectedSortOrder) => {
      const user = userEvent.setup(),
        push = jest.fn();

      useRouterMock.mockReturnValue({
        push,
      } as unknown as NextRouter);

      render(<Home {...props} />);

      const sortDropdown = screen.getByRole("combobox", { name: "Sort" }),
        option = within(sortDropdown).getByRole("option", {
          name: optionLabel,
        });

      await user.selectOptions(sortDropdown, option);

      const expectedSortQuery = expectedSortOrder
        ? `sort=${expectedSortOrder}&`
        : "";

      expect(push).toHaveBeenCalledTimes(1);
      expect(push.mock.calls[0][0]).toHaveProperty(
        "query",
        `investorRiskMin=0&investorRiskMax=1&investorTotalMin=0&investorTotalMax=100&${expectedSortQuery}bankOfEnglandRate=1`
      );
    }
  );

  // Some further tests to do:

  it.todo("should update URL when risk sliders are changed");
  it.todo("should update URL when total investment sliders are changed");
  it.todo("should update URL when bank of england rate is changed");

  it.todo("should render caption for investors table");
  it.todo("should render caption for rates table");
  it.todo(
    "some more tests around table rendering, rounding, column headings etc"
  );

  describe("getServerSideProps", () => {
    it.todo("should load data from API endpoints");
  });
});
