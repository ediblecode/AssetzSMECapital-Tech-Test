import "reflect-metadata";

import { Container } from "inversify";

import { SERVICE_IDENTIFIER } from "../constants/identifiers";
import {
  type IInterestCalculator,
  type IDataLoader,
  type IApp,
  type IPromotion,
} from "../interfaces";
import { DataLoader } from "../services/DataLoader";
import { InterestCalculator } from "../services/InterestCalculator";
import { App } from "../services/App";
import { HighestBalanceBonusPromotion } from "../promotions/HighestBalanceBonusPromotion";
import { LargeBalancePromotion } from "../promotions/LargeBalancePromotion";

const container = new Container();
container.bind<IApp>(SERVICE_IDENTIFIER.APP).to(App);
container.bind<IDataLoader>(SERVICE_IDENTIFIER.DATA_LOADER).to(DataLoader);
container
  .bind<IInterestCalculator>(SERVICE_IDENTIFIER.INTEREST_CALCULATOR)
  .to(InterestCalculator);
container
  .bind<IPromotion>(SERVICE_IDENTIFIER.PROMOTION)
  .to(HighestBalanceBonusPromotion);
container
  .bind<IPromotion>(SERVICE_IDENTIFIER.PROMOTION)
  .to(LargeBalancePromotion);

export { container };
