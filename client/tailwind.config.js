/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        govBlue: "#0b3d91",
        neon: "#00E5FF",
        soft: "#F5F7FB"
      },
      boxShadow: {
        'neon-lg': '0 10px 30px rgba(0,229,255,0.06), 0 6px 20px rgba(11,61,145,0.06)'
      }
    }
  },
  plugins: []
};
