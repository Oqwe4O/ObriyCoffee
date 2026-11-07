// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://obriy-coffee.vercel.app',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),

  devToolbar: {
    enabled: false
  },

  env: {
    schema: {
      TELEGRAM_BOT_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      TELEGRAM_CHAT_ID: envField.string({ context: 'server', access: 'secret', optional: true })
    }
  }
});
