/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#000",
          "primary-content": "#fff",
          
          "secondary": "#e05759",
          "secondary-content": "#fff",

          "accent": "#46b9d6",
          "accent-content": "#fff",

          "neutral": "#fff",
          "neutral-content": "#fff",

          "base-100": "#F3EFF6",
          // "base-100-content": "#fff",

          "info": "#7FBBDC",
          "info-content": "#fff",

          "success": "#6EE2D9",
          "success-content": "#fff",

          "warning": "#F9BA4E",
          "warning-content": "#fff",

          "error": "#EF4B39",
          "error-content": "#fff",
        },
      },
      // "dracula"
    ],

  },
}
