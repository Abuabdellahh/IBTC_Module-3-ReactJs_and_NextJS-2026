export const demoOrder = {
  id: "AE-1042",
  restaurant: "Almaz Kitchen",
  address: "Bole, Addis Ababa, Ethiopia",
  total: 1200,
  placedAt: "2026-10-13T06:30:00.000Z",
  status: "On the way",
  courier: {
    name: "Abebe",
    latitude: 8.9950,
    longitude: 38.7896,
  },
  destination: {
    latitude: 8.9900,
    longitude: 38.7950,
  },
  history: [
    { time: "2026-10-13T06:30:00.000Z", status: "Order received" },
    { time: "2026-10-13T06:35:00.000Z", status: "Preparing" },
    { time: "2026-10-13T06:45:00.000Z", status: "Picked up" },
    { time: "2026-10-13T06:50:00.000Z", status: "On the way" },
  ],
};
