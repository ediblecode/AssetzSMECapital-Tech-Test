import type { NextApiRequest, NextApiResponse } from "next";

import holdings from "./data/holdings.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<typeof holdings>
) {
  res.status(200).json(holdings);
}
