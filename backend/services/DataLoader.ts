import { injectable } from "inversify";
import axios, { type AxiosInstance } from "axios";

import { type RatesResponse, type Holding } from "../../web/types";
import { type IDataLoader } from "../interfaces";

@injectable()
export class DataLoader implements IDataLoader {
  #axiosClient: AxiosInstance;

  constructor() {
    this.#axiosClient = axios.create({
      baseURL: "http://localhost:3000/api/",
      headers: {
        Accept: "application/json",
      },
    });
  }

  async getRates(): Promise<RatesResponse> {
    return (await this.#axiosClient.get<RatesResponse>("/rates")).data;
  }

  async getHoldings(): Promise<Holding[]> {
    return (await this.#axiosClient.get<Holding[]>("/holdings")).data;
  }
}
