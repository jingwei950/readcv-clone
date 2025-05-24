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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
