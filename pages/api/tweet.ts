import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const {
    body: { tweet },
    session: { user },
  } = req;

  if (!(tweet && user))
    return res.status(400).json({ ok: false, error: "requireEveryData" });

  const newTweet = await prisma.tweet.create({
    data: {
      text: tweet as string,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  if (!newTweet)
    return res.status(500).json({ ok: false, error: "creationFailed" });

  res.status(200).json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
