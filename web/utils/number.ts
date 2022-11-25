export const defaultBoERate = 2.25;

export const roundToTwoDecimalPlaces = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const displayCurrency = (num: number | string) =>
  roundToTwoDecimalPlaces(
    typeof num === "string" ? parseFloat(num) : num
  ).toFixed(2);

export const calculateInterest = (
  balance: number,
  annualRate: number,
  bankOfEnglandRate: number
) =>
  roundToTwoDecimalPlaces((balance * (annualRate + bankOfEnglandRate)) / 100);
