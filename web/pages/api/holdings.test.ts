import type { NextApiRequest, NextApiResponse } from "next";

import holdings from "./data/holdings.json";

import holdingsHandler from "./holdings.api";

describe("/api/holdings", () => {
  it("should return array of all holdings", () => {
    const json = jest.fn(),
      req = {} as NextApiRequest,
      res = {
        status: () => ({
          json,
        }),
      } as unknown as NextApiResponse;

    holdingsHandler(req, res);

    expect(json).toHaveBeenCalledWith(holdings);
  });
});
