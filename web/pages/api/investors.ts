import type { NextApiRequest, NextApiResponse } from "next";

import investors from "./data/investors.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<typeof investors>
) {
  res.status(200).json(investors);
}
