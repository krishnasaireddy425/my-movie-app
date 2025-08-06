import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorite: true },
    });
    return res.json({ favorite: user?.favorite?.movie || null });
  }

  if (req.method === "POST") {
    const { movie } = req.body;
    if (!movie) return res.status(400).json({ error: "Movie is required" });

    const updated = await prisma.user.upsert({
      where: { email: session.user.email },
      create: {
        email: session.user.email,
        name: session.user.name!,
        image: session.user.image!,
        favorite: { create: { movie } },
      },
      update: {
        favorite: {
          upsert: {
            create: { movie },
            update: { movie },
          },
        },
      },
      include: { favorite: true },
    });

    return res.status(200).json({ favorite: updated.favorite?.movie });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
