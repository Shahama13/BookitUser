/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        MonoB: ['MonoB', 'sans'],
        Logo: ['Logo', 'sans'],
        Mons: ['Mons', 'sans'],
        MonsB: ['MonsB', 'sans'],
        Quic: ['Quic', 'sans'],
      },
    },
  },
  plugins: [],
}