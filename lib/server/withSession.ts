import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: { id: number };
  }
}

const cookieOptions = {
  cookieName: "tweetsession",
  password:
    "nawri9onbiasvdf98niertsbt89gn345inio3dnbunweruern4387erui8bnkzddfbklzu89897789xdfbbkzweiubnb/QWEGASDRGHVZSDFBzzebn92",
};

export const withApiSession = (func: any) => {
  return withIronSessionApiRoute(func, cookieOptions);
};
