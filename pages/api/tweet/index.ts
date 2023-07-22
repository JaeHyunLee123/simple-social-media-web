import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  if (req.method === "POST") {
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
  } else if (req.method === "GET") {
    const tweets = await prisma.tweet.findMany({
      include: {
        _count: { select: { likes: true } },
        user: { select: { username: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ ok: true, tweets });
  }
};

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler, isPrivate: true })
);
