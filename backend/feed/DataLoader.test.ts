import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { DataLoader } from "./DataLoader";

var mock = new MockAdapter(axios, {
  onNoMatch: "throwException",
});

describe("DataLoader", () => {
  let dataLoader: DataLoader;

  beforeEach(() => {
    dataLoader = new DataLoader();
  });

  afterEach(() => {
    mock.reset();
  });

  describe.each<["getRates" | "getHoldings", string]>([
    ["getRates", "/rates"],
    ["getHoldings", "/holdings"],
  ])("%s method", (methodName, endpoint) => {
    const mockResponse = { test: true };

    beforeEach(() => {
      mock.onGet(endpoint).reply(200, mockResponse);
    });

    it("should pass JSON accept header", () => {
      dataLoader[methodName]();

      expect(mock.history.get[0].headers).toHaveProperty(
        "Accept",
        expect.stringContaining("application/json")
      );
    });

    it(`should get data from ${endpoint} endpoint`, async () => {
      await expect(dataLoader[methodName]()).resolves.toStrictEqual(
        mockResponse
      );
    });
  });
});
