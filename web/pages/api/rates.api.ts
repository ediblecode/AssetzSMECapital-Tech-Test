import type { NextApiRequest, NextApiResponse } from "next";
import type { RatesResponse, RateTotal } from "../../types";
import {
  calculateInterest,
  defaultBoERate,
  summingReducer,
} from "../../utils/number";

import rawRates from "./data/rates.json";
import holdings from "./data/holdings.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RatesResponse>
) {
  const { query } = req;

  if (Array.isArray(query.bankOfEnglandRate))
    throw Error(`Bank of england rate should not be an array`);

  const bankOfEnglandRate =
      parseFloat(query.bankOfEnglandRate || "") || defaultBoERate,
    rates: RateTotal[] = rawRates.map((rate) => {
      const investmentTotal = holdings
          .filter(
            ({ investmentAccount }) =>
              investmentAccount === rate.investmentAccount
          )
          .map(({ balance }) => parseFloat(balance))
          .reduce(summingReducer, 0),
        annualInterest = calculateInterest(
          investmentTotal,
          rate.annualRate,
          bankOfEnglandRate
        );

      return {
        ...rate,
        totalAnnualRate: rate.annualRate + bankOfEnglandRate,
        investmentTotal,
        annualInterest,
      };
    }),
    investmentTotal = rates
      .map(({ investmentTotal }) => investmentTotal)
      .reduce(summingReducer, 0),
    annualInterest = rates
      .map(({ investmentTotal, annualRate }) =>
        calculateInterest(investmentTotal, annualRate, bankOfEnglandRate)
      )
      .reduce(summingReducer, 0);

  res.status(200).json({
    bankOfEnglandRate,
    rates,
    investmentTotal,
    annualInterest,
  });
}
