import { ProfilePage } from "./components/profile-page";

const mockUser = {
    id: "1",
    name: "Wandana Maddumage",
    email: "wandana@example.com",
    role: "client" as const,
    kids: [
      { id: "k1", name: "Emma", age: 7, paymentStatus: "paid" as const },
      { id: "k2", name: "Noah", age: 10, paymentStatus: "unpaid" as const },
    ],
  };

export default function App() {
  return <ProfilePage user={mockUser} />;
}
