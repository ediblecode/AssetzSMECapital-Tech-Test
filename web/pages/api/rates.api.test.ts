import { NextApiRequest, NextApiResponse } from "next";
import { Holding, Rate } from "../../types";
import ratesHandler from "./rates.api";

jest.mock("./data/rates.json", () => [
  {
    id: 1,
    annualRate: 2.25,
    investmentAccount: "ABC",
  } as Rate,
  {
    id: 2,
    annualRate: 3.75,
    investmentAccount: "XYZ",
  } as Rate,
]);

jest.mock("./data/holdings.json", () => [
  {
    balance: "100",
    id: 1,
    investmentAccount: "ABC",
    investorId: 3,
  } as Holding,
  {
    balance: "200",
    id: 2,
    investmentAccount: "ABC",
    investorId: 4,
  } as Holding,
  {
    balance: "300",
    id: 3,
    investmentAccount: "XYZ",
    investorId: 4,
  } as Holding,
]);

describe("/api/rates", () => {
  const json = jest.fn(),
    req = {
      query: {},
    } as NextApiRequest,
    res = {
      status: () => ({
        json,
      }),
    } as unknown as NextApiResponse;

  it("should sum account balances and interest with default BoE rate", () => {
    ratesHandler(req, res);

    expect(json).toHaveBeenCalledWith({
      bankOfEnglandRate: 2.25,
      annualInterest: 31.5,
      investmentTotal: 600,
      rates: [
        {
          annualInterest: 13.5,
          annualRate: 2.25,
          totalAnnualRate: 4.5,
          id: 1,
          investmentAccount: "ABC",
          investmentTotal: 300,
        },
        {
          annualInterest: 18,
          annualRate: 3.75,
          totalAnnualRate: 6,
          id: 2,
          investmentAccount: "XYZ",
          investmentTotal: 300,
        },
      ],
    });
  });

  it("should sum account balances and interest with BoE rate in query string", () => {
    ratesHandler(
      {
        ...req,
        query: {
          bankOfEnglandRate: "1",
        },
      } as unknown as NextApiRequest,
      res
    );

    expect(json).toHaveBeenCalledWith({
      annualInterest: 24,
      bankOfEnglandRate: 1,
      investmentTotal: 600,
      rates: [
        {
          annualInterest: 9.75,
          annualRate: 2.25,
          totalAnnualRate: 3.25,
          id: 1,
          investmentAccount: "ABC",
          investmentTotal: 300,
        },
        {
          annualInterest: 14.25,
          annualRate: 3.75,
          totalAnnualRate: 4.75,
          id: 2,
          investmentAccount: "XYZ",
          investmentTotal: 300,
        },
      ],
    });
  });
});
