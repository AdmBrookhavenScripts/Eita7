import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY = "chat_messages";
const MAX_MESSAGES = 50;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const messages = await redis.lrange(KEY, 0, -1);
      return res.status(200).json(messages || []);
    }

    if (req.method === "POST") {
      const { name, message, thumbnail } = req.body || {};

      if (!name || !message) {
        return res.status(400).json({ error: "invalid" });
      }

      const msg = {
        id: crypto.randomUUID(),
        name,
        message,
        thumbnail,
        time: Date.now(),
      };

      await redis.rpush(KEY, msg);
      await redis.ltrim(KEY, -MAX_MESSAGES, -1);

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(200).json([]);
  }
}
