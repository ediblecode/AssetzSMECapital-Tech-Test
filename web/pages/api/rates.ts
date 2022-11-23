import type { NextApiRequest, NextApiResponse } from "next";
import type { Rate } from "../../types";

import rates from "./data/rates.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Rate[]>
) {
  res.status(200).json(rates);
}
