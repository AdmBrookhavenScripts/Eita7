let messages = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { name, thumbnail, message } = req.body || {};

    if (!name || !message) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const data = {
      id: Date.now() + Math.random(),
      name,
      thumbnail: thumbnail || "",
      message,
      time: Date.now()
    };

    messages.push(data);

    if (messages.length > 100) {
      messages.shift();
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(messages);
  }

  res.status(405).end();
  }
