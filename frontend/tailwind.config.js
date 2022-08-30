const defaultTheme = require('tailwindcss/defaultTheme')


module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "460px",
        xss: "300px",
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#000",
          "primary-content": "#fff",

          secondary: "#E05759",
          "secondary-content": "#fff",

          accent: "#22d3ee",
          "accent-focus": "#06b6d4",

          neutral: "#000",
          "neutral-content": "#fff",

          "base-100": "#fff",
          "base-200": "#f8fafc",
          // "base-200": "#f8fafc",

          // for hover use bg-slate-50

          "base-300": "#fff",

          info: "#7dd3fc",

          success: "#6EE2D9",
          // "success-content": "#fff",

          warning: "#F9BA4E",

          error: "#EF4B39",
          "error-content": "#fff",
        },
      },
      // "dracula"
    ],
  },
};
