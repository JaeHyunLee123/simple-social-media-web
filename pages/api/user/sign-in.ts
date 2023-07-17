import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/server/prismaClient";
import withHandler, { IResposeType } from "@lib/server/withHandler";
import bcript from "bcrypt";
import { Prisma } from ".prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResposeType>
) => {
  const { username, password, passwordConfirm } = req.body;

  if (!(username && password && passwordConfirm))
    return res.status(400).json({ ok: false, error: "requireEveryData" });

  if (password !== passwordConfirm)
    return res.status(400).json({ ok: false, error: "passwordNotConfirmed" });

  const hashedPassword = await bcript.hash(password, 5);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({ ok: false, error: "usernameAlreadyExist" });
    }
  }

  if (!user)
    return res.status(500).json({ ok: false, error: "creationFailed" });

  return res.json({ ok: true });
};

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
