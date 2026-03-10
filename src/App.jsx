import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Brain,
  Gamepad2,
  BookOpen,
  Smartphone,
  Globe,
  MapPin,
} from "lucide-react";
import heroImage from "./assets/hero-car.jpg";
const features = [
  {
    icon: Car,
    title: "Real-World Navigation",
    description:
      "Powered by Google Maps Directions API to provide accurate, real-world routes and realistic vehicle trajectories.",
  },
  {
    icon: Globe,
    title: "Learn Country Rules",
    description:
      "Switch between Australia, USA, UK, Japan, and Germany to learn each country's unique road rules and driving side.",
  },
  {
    icon: Brain,
    title: "AI Autopilot",
    description:
      "Watch autonomous driving in action with real-time turn-by-turn decisions, traffic light awareness, and roundabout navigation.",
  },
  {
    icon: MapPin,
    title: "Custom Routes",
    description:
      "Pick any origin and destination in supported countries and watch the AI confidently navigate the specific route.",
  },
  {
    icon: BookOpen,
    title: "Educational Feedback",
    description:
      "Real-time safety driving tips perfectly matched to your active maneuver, linked directly to the official driver's handbooks.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Learn anywhere with responsive touch controls optimized for any device.",
  },
];

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              DriveSafeAI
            </span>
          </div>
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-3 py-1"
            to="/simulator"
          >
            Launch Simulator
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Self-driving car on a city street"
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              Interactive Driving Education
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Learn to Drive <span className="text-gradient">Safely</span> with AI
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            A 3D educational simulator that teaches road rules, traffic
            navigation, and autonomous vehicle principles across Australia, USA,
            UK, Japan, and Germany.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-3 py-1"
              to="/simulator"
            >
              Start Driving →
            </Link>

            <Link
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-3 py-1"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Features
            </Link>
          </motion.div>

            {/* Quick Start Samples */}
            <motion.div
              className="mt-12 pt-8 border-t border-primary/20 flex flex-col items-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4 block">
                Quick Start Samples (Australia)
              </span>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Link
                  to="/simulator"
                  state={{
                    sample: true,
                    country: 'AU',
                    originQuery: 'Adelaide CBD, South Australia, Australia',
                    destQuery: 'Glenelg Beach, South Australia, Australia',
                  }}
                  className="bg-accent/50 hover:bg-accent border border-white/10 px-4 py-2.5 rounded-lg text-sm text-center transition-colors flex flex-col items-center"
                >
                  <span className="font-bold text-primary mb-0.5">City to Beach</span>
                  <span className="text-xs text-muted-foreground">Adelaide CBD → Glenelg</span>
                </Link>
                <Link
                  to="/simulator"
                  state={{
                    sample: true,
                    country: 'AU',
                    originQuery: 'Sydney Opera House, NSW, Australia',
                    destQuery: 'Bondi Beach, NSW, Australia',
                  }}
                  className="bg-accent/50 hover:bg-accent border border-white/10 px-4 py-2.5 rounded-lg text-sm text-center transition-colors flex flex-col items-center"
                >
                  <span className="font-bold text-primary mb-0.5">Iconic Landmarks</span>
                  <span className="text-xs text-muted-foreground">Opera House → Bondi</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Learn Safe Driving
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From traffic lights to roundabouts, explore every aspect of road
              safety with AI-powered guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center glass rounded-2xl p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Take the Wheel?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Jump into the simulator and learn road safety through hands-on
            driving. No setup required.
          </p>
          <Link
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-3 py-1"
            to="/simulator"
          >
            Launch Simulator →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">
              DriveSafeAI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for students. Learn road safety interactively.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
