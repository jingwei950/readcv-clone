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
      screens: {
        sm: "279px",
        // => @media (min-width: 640px) { ... }

        md: "541px",
        // => @media (min-width: 768px) { ... }

        lg: "800px",
        // => @media (min-width: 1024px) { ... }

        xl: "1080px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1280px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
