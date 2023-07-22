import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const { user: loggedInUser } = req.session;

  if (!loggedInUser)
    return res.status(400).json({ ok: false, error: "requireEveryData" });

  const user = await prisma.user.findUnique({
    where: {
      id: loggedInUser.id,
    },
  });

  if (!user) res.status(400).json({ ok: false, error: "noExist" });

  const likingTweetsPromise = prisma.like.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      tweet: {
        include: {
          _count: { select: { likes: true } },
          user: { select: { username: true } },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const postedTweetsPromise = prisma.tweet.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      _count: { select: { likes: true } },
      user: { select: { username: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const [likingTweets, postedTweets] = await Promise.all([
    likingTweetsPromise,
    postedTweetsPromise,
  ]);

  return res.status(200).json({ ok: true, user, likingTweets, postedTweets });
};
export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
