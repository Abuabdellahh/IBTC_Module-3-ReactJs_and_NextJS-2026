import Link from "next/link";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food delivery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", gap: "1rem" }}>
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/orders">Orders</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
