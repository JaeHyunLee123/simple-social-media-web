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

  const likedTweetsPromise = prisma.like.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      tweet: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const postedTweetsPromise = prisma.tweet.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const [likedTweets, postedTweets] = await Promise.all([
    likedTweetsPromise,
    postedTweetsPromise,
  ]);

  return res.status(200).json({ ok: true, user, likedTweets, postedTweets });
};
export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
