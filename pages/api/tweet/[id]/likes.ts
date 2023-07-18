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

  const alreadyExist = await prisma.like.findFirst({
    where: {
      userId: user.id,
      tweetId: +id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (alreadyExist) {
    await prisma.like.delete({
      where: {
        id: alreadyExist.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  return res.status(200).json({ ok: true });
};
export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
