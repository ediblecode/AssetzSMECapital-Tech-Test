import { DataLoader } from "./feed/DataLoader";

const dataLoader = new DataLoader();

const init = async () => {
  const rates = await dataLoader.getRates();

  console.log(rates);
};

init();
