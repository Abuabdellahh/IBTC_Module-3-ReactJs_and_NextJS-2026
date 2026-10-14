import { notFound } from "next/navigation";
import { demoOrder } from "@/lib/orders";
import TrackingClient from "./TrackingClient";

export default async function TrackingPage({ params }) {
  const { id } = await params;
  if (id !== demoOrder.id) {
    notFound();
  }
  return <TrackingClient order={demoOrder} />;
}
