export const defaultBoERate = 2.25;

export const roundToTwoDecimalPlaces = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const displayCurrency = (num: number | string) =>
  roundToTwoDecimalPlaces(
    typeof num === "string" ? parseFloat(num) : num
  ).toFixed(2);

export const calculateInterest = (
  balance: number | string,
  annualRate: number,
  bankOfEnglandRate: number
) =>
  roundToTwoDecimalPlaces(
    ((typeof balance === "string" ? parseFloat(balance) : balance) *
      (annualRate + bankOfEnglandRate)) /
      100
  );

export const summingReducer = (total: number, amount: number) =>
  (total += amount);
