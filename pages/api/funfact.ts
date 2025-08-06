import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { favorite: true },
  });
  if (!user?.favorite) {
    return res.status(400).json({ error: "No favorite movie found" });
  }

  const prompt = `Share one new, interesting fun fact about the movie "${user.favorite.movie}".`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  const fact = completion.choices?.[0]?.message?.content?.trim() || "No fact generated.";
  res.json({ fact });
}
