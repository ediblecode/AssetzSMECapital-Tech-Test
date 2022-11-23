import type { NextApiRequest, NextApiResponse } from "next";
import type { Holding } from "../../types";

import holdings from "./data/holdings.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Holding[]>
) {
  res.status(200).json(holdings as Holding[]);
}
