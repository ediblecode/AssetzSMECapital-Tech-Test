import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Holding, RatesResponse } from "../../web/types";

import { container } from "../config/ioc.config";
import { SERVICE_IDENTIFIER } from "../constants/identifiers";
import { App } from "./App";

const rates = {
    rates: [
      {
        id: 1,
        investmentAccount: "ABC",
        annualRate: 3.7,
      },
      { id: 2, investmentAccount: "XYZ", annualRate: 1.2 },
    ],
  } as RatesResponse,
  holdings = [
    {
      balance: "275",
      id: 1,
      investmentAccount: "ABC",
      investorId: 1,
    },
    {
      balance: "375",
      id: 2,
      investmentAccount: "XYZ",
      investorId: 1,
    },
    {
      balance: "500",
      id: 3,
      investmentAccount: "ABC",
      investorId: 2,
    },
    {
      balance: "501",
      id: 4,
      investmentAccount: "XYZ",
      investorId: 2,
    },
  ] as Holding[],
  mock = new MockAdapter(axios, {
    onNoMatch: "throwException",
  })
    .onGet("/rates")
    .reply(200, rates)
    .onGet("/holdings")
    .reply(200, holdings);

describe("App", () => {
  let app: App;

  beforeEach(() => {
    app = container.get(SERVICE_IDENTIFIER.APP);
  });

  it("should get portfolios with promotions", () => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 0, 1));

    expect(app.getPortfolios()).resolves.toStrictEqual([
      {
        investorId: 1,
        totalValue: 275 + 375,
        totalDailyPortfolioValue:
          275 +
          (275 * (3.7 / 100)) / 365 +
          375 +
          (375 * ((1.2 + 1) / 100)) / 365,
        totalAnnualPortfolioValue:
          275 * Math.pow(1 + 3.7 / 100 / 365, 365) +
          375 * Math.pow(1 + (1.2 + 1) / 100 / 365, 365),
      },
      {
        investorId: 2,
        totalValue: 500 + 501,
        totalDailyPortfolioValue:
          500 +
          (500 * (3.7 / 100)) / 365 +
          501 +
          (501 * ((1.2 + 1) / 100)) / 365,
        totalAnnualPortfolioValue:
          500 * Math.pow(1 + 3.7 / 100 / 365, 365) +
          501 * Math.pow(1 + (1.2 + 1) / 100 / 365, 365),
      },
    ]);
  });
});
