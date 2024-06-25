/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      primary: "#0077C0", //Blue
      black: "#212121", // Black
      white: "#FAFAFA", // White
      gray: "#E5E4E2",
      darkgray: "#D3D3D3",
      green: "#2E8B57",
      red: "#D22B2B",
      blackTransparent: "rgba(0, 0, 0, 0.5)",
      link: "#0000ff",
    },
    extend: {},
  },
  plugins: [],
};
