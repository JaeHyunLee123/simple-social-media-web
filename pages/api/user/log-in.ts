import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import { withApiSession } from "@lib/server/withSession";
import bcrypt from "bcrypt";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const { username, password } = req.body;

  if (!(username && password))
    return res.status(400).json({ ok: false, error: "requireEveryData" });

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return res.status(400).json({ ok: false, error: "noExist" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ ok: false, error: "passwordIncorrect" });

  req.session.user = {
    id: user.id,
  };
  await req.session.save();

  res.status(200).json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
