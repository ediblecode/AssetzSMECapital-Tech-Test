import { type Holding, type Rate } from "../../web/types";

export interface IPromotion {
  getAdditionalRate: (holding: Holding, holdings: Holding[]) => number;
}
