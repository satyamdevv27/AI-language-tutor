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
    <div className="min-h-screen 
      bg-gradient-to-br from-zinc-100 via-gray-100 to-white 
      dark:from-zinc-950 dark:via-zinc-900 dark:to-black 
      px-6 py-14 text-gray-900 dark:text-white">

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight 
          bg-gradient-to-r from-indigo-600 to-purple-600 
          dark:from-indigo-400 dark:to-purple-400 
          bg-clip-text text-transparent">
          Real-World Conversation Practice
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-4 max-w-2xl mx-auto">
          Train your English by speaking in realistic situations designed to make you confident in the real world.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => navigate(`/scenario/${scenario.id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-3xl 
              bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl 
              border border-black/5 dark:border-white/5 
              transition-all duration-500 hover:-translate-y-2 
              hover:border-indigo-500/40 
              hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.4)]"
          >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={scenario.image}
                alt={scenario.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t 
                from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                {scenario.title}
              </h2>

              <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                {scenario.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-zinc-500">
                  Interactive AI
                </span>

                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition">
                  Start
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>

            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl 
              bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
              opacity-0 group-hover:opacity-100 transition"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScenarioSelect;
