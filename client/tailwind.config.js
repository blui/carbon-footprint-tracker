module.exports = {
  // Define which files Tailwind should scan for class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JavaScript, TypeScript, and JSX/TSX files within the src directory
  ],

  // Extend Tailwind's default theme with custom values (colors, fonts, etc.)
  theme: {
    extend: {}, // Currently empty, but can be used to add customizations in the future
  },

  // Add any Tailwind plugins (such as forms, typography) here
  plugins: [],
};
