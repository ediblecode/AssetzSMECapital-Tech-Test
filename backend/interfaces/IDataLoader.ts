import { type Holding, type RatesResponse } from "../../web/types";

export interface IDataLoader {
  getRates(): Promise<RatesResponse>;

  getHoldings(): Promise<Holding[]>;
}
