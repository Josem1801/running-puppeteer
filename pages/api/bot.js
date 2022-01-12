// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import searchProfanity from "../../puppeteer/searchProfanity";

export default async function handler(req, res) {
  const { email, password, postUrls } = req.body;
  const comments = await searchProfanity({ email, password, postUrls });
  res.status(200).json({ comments: comments });
}
