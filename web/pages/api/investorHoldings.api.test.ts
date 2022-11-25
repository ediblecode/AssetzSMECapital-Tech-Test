import investorHoldingsHandler from "./investorHoldings.api";
import type { NextApiRequest, NextApiResponse } from "next";
import { defaultBoERate } from "../../utils/number";
import { Holding, Investor, InvestorHoldingResponse, Rate } from "../../types";

jest.mock("./data/rates.json", () => [
  {
    id: 1,
    annualRate: 2,
    investmentAccount: "ABC",
  } as Rate,
  {
    id: 2,
    annualRate: 3,
    investmentAccount: "XYZ",
  } as Rate,
]);

jest.mock("./data/holdings.json", () => [
  {
    balance: "100",
    id: 1,
    investmentAccount: "ABC",
    investorId: 1,
  } as Holding,
  {
    balance: "200",
    id: 2,
    investmentAccount: "ABC",
    investorId: 2,
  } as Holding,
  {
    balance: "300",
    id: 3,
    investmentAccount: "XYZ",
    investorId: 2,
  } as Holding,
]);

jest.mock("./data/investors.json", () => [
  {
    id: 1,
    name: "Investor 1",
    riskLevel: 0.5,
  } as Investor,
  {
    id: 2,
    name: "Investor 2",
    riskLevel: 0.5,
  } as Investor,
]);

const json = jest.fn(),
  req = {
    query: {
      bankOfEnglandRate: 1,
    },
  } as unknown as NextApiRequest,
  res = {
    status: () => ({
      json,
    }),
  } as unknown as NextApiResponse;

describe("/api/ivnestorHoldings", () => {
  it("should return default BoE rate when not passed in the query", () => {
    investorHoldingsHandler({ ...req, query: {} } as NextApiRequest, res);
    expect(json.mock.calls[0][0]).toHaveProperty(
      "bankOfEnglandRate",
      defaultBoERate
    );
  });

  it("should return BoE rate from query", () => {
    investorHoldingsHandler(req, res);

    expect(json.mock.calls[0][0]).toHaveProperty("bankOfEnglandRate", 1);
  });

  it("should return investors and holding", () => {
    investorHoldingsHandler(req, res);
    expect(json.mock.calls[0][0]).toMatchInlineSnapshot(`
{
  "bankOfEnglandRate": 1,
  "investorHoldings": [
    {
      "annualInterest": 3,
      "holdings": [
        {
          "balance": "100",
          "id": 1,
          "investmentAccount": "ABC",
          "investorId": 1,
        },
      ],
      "investor": {
        "id": 1,
        "name": "Investor 1",
        "riskLevel": 0.5,
      },
      "totalHolding": 100,
    },
    {
      "annualInterest": 18,
      "holdings": [
        {
          "balance": "200",
          "id": 2,
          "investmentAccount": "ABC",
          "investorId": 2,
        },
        {
          "balance": "300",
          "id": 3,
          "investmentAccount": "XYZ",
          "investorId": 2,
        },
      ],
      "investor": {
        "id": 2,
        "name": "Investor 2",
        "riskLevel": 0.5,
      },
      "totalHolding": 500,
    },
  ],
  "maximumHolding": 500,
  "maximumRiskLevel": 0.5,
  "minimumHolding": 100,
  "minimumRiskLevel": 0.5,
}
`);
  });

  it.each([
    ["totalAsc", "Investor 2, Investor 1"],
    ["totalDesc", "Investor 1, Investor 2"],
    ["nameAsc", "Investor 1, Investor 2"],
    ["nameDesc", "Investor 2, Investor 1"],
  ])(
    "should sort investors by %s when passed in query string",
    (sort, expectedOrder) => {
      investorHoldingsHandler(
        {
          ...req,
          query: {
            sort,
          },
        } as unknown as NextApiRequest,
        res
      );

      const response = json.mock.calls[0][0] as InvestorHoldingResponse;

      expect(
        response.investorHoldings.map((i) => i.investor.name).join(", ")
      ).toStrictEqual(expectedOrder);
    }
  );
});
