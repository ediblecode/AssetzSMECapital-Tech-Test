import type { NextApiRequest, NextApiResponse } from "next";

import rates from "./data/rates.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<typeof rates>
) {
  res.status(200).json(rates);
}
