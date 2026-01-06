import { useNavigate } from "react-router-dom";

const scenarios = [
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Practice answering interview questions with an HR.",
    image: "/scenario/interview.webp",
  },
  {
    id: "restaurant",
    title: "Restaurant Ordering",
    description: "Order food and talk to a waiter confidently.",
    image: "/scenario/restro.webp",
  },
  {
    id: "hotel",
    title: "Hotel Check-in",
    description: "Talk to a hotel receptionist during check-in.",
    image: "/scenario/hotel.webp",
  },
  {
    id: "airport",
    title: "Airport Conversation",
    description: "Speak with airport staff for check-in and boarding.",
    image: "/scenario/airline.jpg",
  },
  {
    id: "customer-support",
    title: "Customer Support",
    description: "Handle issues with a customer care agent.",
    image: "/scenario/customer.jpg",
  },
];

function ScenarioSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Scenario Based Practice
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => navigate(`/scenario/${scenario.id}`)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={scenario.image}
              alt={scenario.title}
              className="h-50 w-full object-cover rounded-md mb-4"
            />

            <h2 className="text-lg font-semibold">
              {scenario.title}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {scenario.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScenarioSelect;
