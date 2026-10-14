import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home">
      <h1>Addis Eats</h1>
      <p>Track your food delivery from the restaurant to your door.</p>
      <Link href="/track/AE-1042">Track order AE-1042</Link>
    </main>
  );
}
