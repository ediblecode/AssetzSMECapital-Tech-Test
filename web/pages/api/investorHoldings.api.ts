import type { NextApiRequest, NextApiResponse } from "next";
import type {
  Holding,
  Investor,
  InvestorHolding,
  InvestorHoldingResponse,
} from "../../types";
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
  res: NextApiResponse<InvestorHoldingResponse>
) {
  const { query } = req;

  if (Array.isArray(query.bankOfEnglandRate))
    throw Error(`Bank of england rate should not be an array`);

  const bankOfEnglandRate =
    parseFloat(query.bankOfEnglandRate || "") || defaultBoERate;

  const allInvestorHoldings: InvestorHolding[] = investors.map((investor) => {
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

  const riskLevels = investors.map((i) => i.riskLevel),
    minimumRiskLevel = Math.min(...riskLevels),
    maximumRiskLevel = Math.max(...riskLevels),
    holdingTotals = allInvestorHoldings.map((h) => h.totalHolding),
    minimumHolding = Math.min(...holdingTotals),
    maximumHolding = Math.max(...holdingTotals),
    investorRiskMin = parseFloat(query.investorRiskMin as string) ?? 0,
    investorRiskMax = parseFloat(query.investorRiskMax as string) ?? 1,
    investorTotalMin = parseFloat(query.investorTotalMin as string) ?? 0,
    investorTotalMax =
      parseFloat(query.investorTotalMax as string) ?? Number.MAX_VALUE;

  const investorHoldings = allInvestorHoldings.filter(
    ({ investor: { riskLevel }, totalHolding }) =>
      riskLevel >= investorRiskMin &&
      riskLevel <= investorRiskMax &&
      roundCurrency(totalHolding) >= roundCurrency(investorTotalMin) &&
      roundCurrency(totalHolding) <= roundCurrency(investorTotalMax)
  );

  res.status(200).json({
    bankOfEnglandRate,
    investorHoldings,
    minimumRiskLevel,
    maximumRiskLevel,
    minimumHolding,
    maximumHolding,
  });
}
