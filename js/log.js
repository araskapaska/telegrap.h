async function logVisitor(slug) {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const message = `
🕵️‍♂️ Посетитель статьи: ${slug}
🌍 IP: ${data.ip}
📍 Страна: ${data.country_name}
🏙 Город: ${data.city}
🌐 Организация: ${data.org}
🕰 Локальное время: ${data.utc_offset}
`;

    await fetch(`https://api.telegram.org/bot7329999473:AAEglilZMhtE6Iyr_uhLLRlI-32cIROEmNY/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: 2079893058,
        text: message,
      }),
    });
  } catch (e) {
    console.error("Ошибка логгирования:", e);
  }
}
