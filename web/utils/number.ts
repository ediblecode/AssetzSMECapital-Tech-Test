export const defaultBoERate = 2.25;

export const roundCurrency = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const displayCurrency = (num: number | string) =>
  roundCurrency(typeof num === "string" ? parseFloat(num) : num).toFixed(2);

export const calculateInterest = (
  balance: number,
  annualRate: number,
  bankOfEnglandRate: number
) => roundCurrency((balance * (annualRate + bankOfEnglandRate)) / 100);
