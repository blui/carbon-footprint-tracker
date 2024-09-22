module.exports = {
  // Define which files Tailwind should scan for class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JavaScript, TypeScript, and JSX/TSX files within the src directory
  ],

  // Extend Tailwind's default theme with custom values (colors, fonts, etc.)
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Dark Blue
        secondary: "#64748b", // Cool Gray
        accent: "#1d4ed8", // Bright Blue for accents
        neutral: "#f3f4f6", // Light Gray for backgrounds
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Set Inter as the base sans-serif font
      },
    },
  },
  plugins: [],
};
