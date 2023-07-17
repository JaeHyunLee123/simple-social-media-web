import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const {
    query: { id },
    session: { user },
  } = req;

  if (!(id && user))
    return res.status(400).json({ ok: false, error: "requireEveryData" });

  const tweet = await prisma.tweet.findUnique({
    where: { id: +id.toString() },
    include: {
      _count: { select: { likes: true } },
      user: { select: { username: true } },
    },
  });

  if (!tweet) return res.status(400).json({ ok: false, error: "noExist" });

  return res.status(200).json({ ok: true, tweet });
};
export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
