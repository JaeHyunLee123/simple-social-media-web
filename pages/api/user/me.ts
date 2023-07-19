import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const profile = await prisma.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });

  if (!profile) res.status(404).json({ ok: false });

  res.status(200).json({ ok: true, profile });
};

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
