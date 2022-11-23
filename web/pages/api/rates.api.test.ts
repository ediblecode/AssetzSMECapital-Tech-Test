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
      bankOfEnglandRate: expect.any(Number),
      rates: [
        {
          annualInterest: 13.5,
          annualRate: 4.5,
          id: 1,
          investmentAccount: "ABC",
          investmentTotal: 300,
        },
        expect.any(Object),
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
      bankOfEnglandRate: 1,
      rates: [
        {
          annualInterest: 9.75,
          annualRate: 3.25,
          id: 1,
          investmentAccount: "ABC",
          investmentTotal: 300,
        },
        expect.any(Object),
      ],
    });
  });
});
