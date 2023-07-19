import { NextApiRequest, NextApiResponse } from "next";

import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  req.session.destroy();
  res.status(200).json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["DELETE"], handler, isPrivate: false })
);
