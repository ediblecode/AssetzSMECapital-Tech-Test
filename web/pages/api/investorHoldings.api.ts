import type { NextApiRequest, NextApiResponse } from "next";
import type { Holding, Investor, InvestorHolding } from "../../types";
import {
  calculateInterest,
  defaultBoERate,
  roundCurrency,
} from "../../utils/number";

import allHoldings from "./data/holdings.json";
import investors from "./data/investors.json";
import rates from "./data/rates.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvestorHolding[]>
) {
  const { query } = req;

  if (Array.isArray(query.bankOfEnglandRate))
    throw Error(`Bank of england rate should not be an array`);

  const bankOfEnglandRate =
    parseFloat(query.bankOfEnglandRate || "") || defaultBoERate;

  const investorHoldings: InvestorHolding[] = investors.map((investor) => {
    const holdings = allHoldings.filter(
        (holding) => holding.investorId === investor.id
      ),
      totalHolding = holdings.reduce(
        (total, holding) => (total += parseFloat(holding.balance)),
        0
      ),
      annualInterest = holdings
        .map((holding) => {
          const rate = rates.find(
            (rate) => rate.investmentAccount === holding.investmentAccount
          );

          if (!rate)
            throw Error(
              `Rate for account ${holding.investmentAccount} could not be found`
            );

          return calculateInterest(
            parseFloat(holding.balance),
            rate.annualRate,
            bankOfEnglandRate
          );
        })
        .reduce((total, amount) => (total += amount), 0);

    return {
      investor,
      holdings,
      totalHolding,
      annualInterest,
    };
  });

  res.status(200).json(investorHoldings);
}
