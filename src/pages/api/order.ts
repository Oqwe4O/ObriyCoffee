import type { APIRoute } from 'astro';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from 'astro:env/server';
import { coffees, grinds, weights } from '../../data/coffees';

export const prerender = false;

function reply(status: number, message: string) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown> | null;

  try {
    body = await request.json();
  } catch {
    return reply(400, 'Некоректний запит.');
  }

  if (!body) return reply(400, 'Некоректний запит.');

  const successMessage = 'Дякуємо! Ми зателефонуємо вам протягом дня.';

  // honeypot: людина це поле не бачить, а боти заповнюють
  if (body.company) return reply(200, successMessage);

  const name = text(body.name, 80);
  const phone = text(body.phone, 30);
  const phoneDigits = phone.replace(/\D/g, '');
  const comment = text(body.comment, 500);
  const grind = grinds.find((item) => item === body.grind);
  const coffee = coffees.find((item) => item.slug === body.coffee);
  const weight = weights.find((item) => item.id === body.weight);

  if (name.length < 2) return reply(400, 'Вкажіть, будь ласка, ім’я.');
  if (!/^\+?[\d\s()-]+$/.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 13) {
    return reply(400, 'Перевірте номер телефону.');
  }
  if (!coffee || !weight || !grind) return reply(400, 'Оберіть каву, вагу та помел.');

  const message = [
    'Нове замовлення',
    `Ім’я: ${name}`,
    `Телефон: ${phone}`,
    `Кава: ${coffee.name}, ${coffee.region}`,
    `Вага: ${weight.label}`,
    `Помел: ${grind}`,
    `Сума: ${coffee.prices[weight.id]} грн`,
    comment && `Коментар: ${comment}`,
  ]
    .filter(Boolean)
    .join('\n');

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    if (import.meta.env.DEV) {
      console.log(message);
      return reply(200, successMessage);
    }
    return reply(500, 'Форма тимчасово не працює. Спробуйте пізніше.');
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    });

    if (!response.ok) {
      console.error('Telegram error:', response.status, await response.text());
      return reply(502, 'Не вдалося надіслати заявку. Спробуйте ще раз.');
    }
  } catch (error) {
    console.error('Telegram request failed:', error);
    return reply(502, 'Не вдалося надіслати заявку. Спробуйте ще раз.');
  }

  return reply(200, successMessage);
};
