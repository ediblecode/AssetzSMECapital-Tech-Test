import type { NextApiRequest, NextApiResponse } from "next";
import type { Investor } from "../../types";

import investors from "./data/investors.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Investor[]>
) {
  res.status(200).json(investors);
}
