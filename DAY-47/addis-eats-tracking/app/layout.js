import "./globals.css";

export const metadata = {
  title: "Addis Eats Tracking",
  description: "Track an Addis Eats delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
