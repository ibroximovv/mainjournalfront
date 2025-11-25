import { motion, useInView } from "framer-motion";
import { Users, FileText, BookOpen, User } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface InfoCard {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const infoCards: InfoCard[] = [
  { 
    title: "Journals", 
    count: 2, 
    icon: <BookOpen className="w-10 h-10" />,
    color: "from-[#0a1f35] to-[#133654]",
    gradient: "bg-gradient-to-br from-[#0a1f35]/20 to-[#133654]/20"
  },
  { 
    title: "Articles", 
    count: 234, 
    icon: <FileText className="w-10 h-10" />,
    color: "from-[#133654] to-[#1a4a6f]",
    gradient: "bg-gradient-to-br from-[#133654]/20 to-[#1a4a6f]/20"
  },
  { 
    title: "Members", 
    count: 3934, 
    icon: <Users className="w-10 h-10" />,
    color: "from-[#1a4a6f] to-[#133654]",
    gradient: "bg-gradient-to-br from-[#1a4a6f]/20 to-[#133654]/20"
  },
  { 
    title: "Authors", 
    count: 134, 
    icon: <User className="w-10 h-10" />,
    color: "from-[#0a1f35] to-[#1a4a6f]",
    gradient: "bg-gradient-to-br from-[#0a1f35]/20 to-[#1a4a6f]/20"
  },
];

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(10, 31, 53, 0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-20%", "120%"],
          y: ["0%", "100%", "0%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(19, 54, 84, 0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["120%", "-20%"],
          y: ["100%", "0%", "100%"],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(26, 74, 111, 0.6) 0%, transparent 70%)",
        }}
        animate={{
          x: ["50%", "50%"],
          y: ["-20%", "120%"],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            background: `radial-gradient(circle, ${
              ["rgba(10, 31, 53, 0.3)", "rgba(19, 54, 84, 0.3)", "rgba(26, 74, 111, 0.3)"][
                Math.floor(Math.random() * 3)
              ]
            } 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, Math.random() + 0.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Animated Grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(19, 54, 84, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(19, 54, 84, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Flowing Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(19, 54, 84, 0)" />
            <stop offset="50%" stopColor="rgba(19, 54, 84, 0.5)" />
            <stop offset="100%" stopColor="rgba(19, 54, 84, 0)" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(26, 74, 111, 0)" />
            <stop offset="50%" stopColor="rgba(26, 74, 111, 0.5)" />
            <stop offset="100%" stopColor="rgba(26, 74, 111, 0)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M 0 100 Q 250 50 500 100 T 1000 100"
          stroke="url(#lineGradient1)"
          strokeWidth="3"
          fill="none"
          animate={{
            d: [
              "M 0 100 Q 250 50 500 100 T 1000 100",
              "M 0 100 Q 250 150 500 100 T 1000 100",
              "M 0 100 Q 250 50 500 100 T 1000 100",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.path
          d="M 0 200 Q 300 250 600 200 T 1200 200"
          stroke="url(#lineGradient2)"
          strokeWidth="3"
          fill="none"
          animate={{
            d: [
              "M 0 200 Q 300 250 600 200 T 1200 200",
              "M 0 200 Q 300 150 600 200 T 1200 200",
              "M 0 200 Q 300 250 600 200 T 1200 200",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

// Counter Animation Component
const CounterAnimation = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const InformationHome = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section className="relative w-full py-20 px-4 md:px-10 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <AnimatedBackground />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-[#0a1f35] via-[#133654] to-[#1a4a6f] bg-clip-text text-transparent">
              Our Statistics
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our academic achievements and community
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              {/* Glow Effect on Hover */}
              <motion.div
                className={`absolute -inset-1 rounded-2xl ${card.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
              />

              {/* Card Content */}
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-100 overflow-hidden">
                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`} />

                {/* Icon Container */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.color} mb-6 shadow-lg relative z-10`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-white">
                    {card.icon}
                  </div>
                </motion.div>

                {/* Count with Animation */}
                <motion.h2
                  className={`text-4xl font-bold mb-2 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                >
                  <CounterAnimation end={card.count} duration={2} />
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.8 }}
                  >
                    +
                  </motion.span>
                </motion.h2>

                {/* Title */}
                <p className="text-gray-600 text-lg font-medium">{card.title}</p>

                {/* Animated Progress Bar */}
                <motion.div
                  className="h-1 rounded-full mt-4 overflow-hidden bg-gray-200"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1, delay: idx * 0.1 + 0.5 }}
                  style={{ transformOrigin: "left" }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${card.color}`}
                    initial={{ x: "-100%" }}
                    animate={isInView ? { x: "0%" } : {}}
                    transition={{ duration: 1.5, delay: idx * 0.1 + 0.7 }}
                  />
                </motion.div>

                {/* Hover Shine Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#133654]/10 to-[#1a4a6f]/10 rounded-full border border-[#133654]/30">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-[#133654] to-[#1a4a6f]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-sm font-medium text-gray-600">
              Updated in real-time
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InformationHome;