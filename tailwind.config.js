/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: [
    "./index.html",
    "./src/**/*.{html,ts,md}",
    "./spartan-ng-components/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        graphik: ["Graphik"],
      },
    },
  },
  plugins: [],
};
