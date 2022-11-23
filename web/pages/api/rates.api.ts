import type { NextApiRequest, NextApiResponse } from "next";
import type { Rates } from "../../types";
import { calculateInterest, defaultBoERate } from "../../utils/number";

import rates from "./data/rates.json";
import holdings from "./data/holdings.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Rates>
) {
  const { query } = req;

  if (Array.isArray(query.bankOfEnglandRate))
    throw Error(`Bank of england rate should not be an array`);

  const bankOfEnglandRate =
    parseFloat(query.bankOfEnglandRate || "") || defaultBoERate;

  res.status(200).json({
    bankOfEnglandRate,
    rates: rates.map((rate) => {
      const investmentTotal = holdings
          .filter(
            (holding) => holding.investmentAccount === rate.investmentAccount
          )
          .map((holding) => parseFloat(holding.balance))
          .reduce((total, balance) => (total += balance), 0),
        annualInterest = calculateInterest(
          investmentTotal,
          rate.annualRate,
          bankOfEnglandRate
        );

      return {
        ...rate,
        annualRate: rate.annualRate + bankOfEnglandRate,
        investmentTotal,
        annualInterest,
      };
    }),
  });
}
