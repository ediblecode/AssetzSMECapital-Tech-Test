import type { NextApiRequest, NextApiResponse } from "next";
import type {
  Holding,
  Investor,
  InvestorHolding,
  InvestorHoldingResponse,
  Rate,
} from "../../types";
import {
  calculateInterest,
  defaultBoERate,
  roundToTwoDecimalPlaces,
  summingReducer,
} from "../../utils/number";

import allHoldings from "./data/holdings.json";
import investors from "./data/investors.json";
import rates from "./data/rates.json";

const getRate = (investmentAccount: string): Rate => {
  const rate = rates.find(
    (rate) => rate.investmentAccount === investmentAccount
  );

  if (!rate)
    throw Error(`Rate for account ${investmentAccount} could not be found`);

  return rate;
};

export default function handler(
  { query }: NextApiRequest,
  res: NextApiResponse<InvestorHoldingResponse>
) {
  if (Array.isArray(query.bankOfEnglandRate))
    throw Error(`Bank of england rate should not be an array`);

  const bankOfEnglandRate =
    parseFloat(query.bankOfEnglandRate || "") || defaultBoERate;

  const allInvestorHoldings: InvestorHolding[] = investors.map((investor) => {
    const holdings = allHoldings.filter(
        ({ investorId }) => investorId === investor.id
      ),
      totalHolding = holdings
        .map(({ balance }) => parseFloat(balance))
        .reduce(summingReducer, 0),
      annualInterest = holdings
        .map((holding) =>
          calculateInterest(
            holding.balance,
            getRate(holding.investmentAccount).annualRate,
            bankOfEnglandRate
          )
        )
        .reduce(summingReducer, 0);

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
    investorRiskMin = parseFloat(query.investorRiskMin as string) || 0,
    investorRiskMax = parseFloat(query.investorRiskMax as string) || 1,
    investorTotalMin = parseFloat(query.investorTotalMin as string) || 0,
    investorTotalMax =
      parseFloat(query.investorTotalMax as string) || Number.MAX_VALUE;

  const investorHoldings = allInvestorHoldings
    .filter(
      ({ investor: { riskLevel }, totalHolding }) =>
        riskLevel >= investorRiskMin &&
        riskLevel <= investorRiskMax &&
        roundToTwoDecimalPlaces(totalHolding) >=
          roundToTwoDecimalPlaces(investorTotalMin) &&
        roundToTwoDecimalPlaces(totalHolding) <=
          roundToTwoDecimalPlaces(investorTotalMax)
    )
    .sort((a, b) => {
      if (query.sort === "nameAsc")
        return a.investor.name.localeCompare(b.investor.name);
      else if (query.sort === "nameDesc")
        return b.investor.name.localeCompare(a.investor.name);
      else if (query.sort === "totalAsc")
        return b.totalHolding - a.totalHolding;
      else if (query.sort === "totalDesc")
        return a.totalHolding - b.totalHolding;

      return 0;
    });

  res.status(200).json({
    bankOfEnglandRate,
    investorHoldings,
    minimumRiskLevel,
    maximumRiskLevel,
    minimumHolding,
    maximumHolding,
  });
}
