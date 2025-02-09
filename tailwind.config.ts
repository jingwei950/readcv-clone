import type { Config } from 'tailwindcss';

export default {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: ['./index.html', './libs/ui/**/*', './src/**/*.{html,ts,md,analog,ag}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
      },
      colors: {
        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        grey1: 'hsl(var(--grey1))',
        grey2: 'hsl(var(--grey2))',
        grey3: 'hsl(var(--grey3))',
        primaryBorderColor: 'hsl(var(--primaryBorderColor))',
        secondaryBorderColor: 'hsl(var(--secondaryBorderColor))',
        transparentBorder: 'hsla(var(--transparentBorder), 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
