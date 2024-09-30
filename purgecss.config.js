module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.ts",
  ],
  css: [
    "./src/styles/*.scss", // Inclure tous tes fichiers SCSS
    "./src/**/*.scss"
  ],
  output: "./dist/purged", // Où les fichiers purgés seront placés
  safelist: [], // Ajouter des classes que tu veux garder
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  cssOptions: {
    parser: require('postcss-scss'), // Utilise le parser SCSS
  }
};