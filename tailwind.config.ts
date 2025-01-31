import type { Config } from 'tailwindcss';

export default {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './index.html',
    './libs/ui/**/*',
    './src/**/*.{html,ts,md,analog,ag}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
