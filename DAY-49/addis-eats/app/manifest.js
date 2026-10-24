// app/manifest.js → /manifest.webmanifest

export default function manifest() {
  return {
    name: "Addis Eats",
    short_name: "Addis Eats",
    description: "Ethiopian food, delivered across Addis Ababa.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f4",
    theme_color: "#b3311d",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
