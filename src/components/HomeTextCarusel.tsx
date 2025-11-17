import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  text: string;
  author: string;
  position: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    text: "We have worked with IC for over 20 years and can say that the company has been by our side every step of the way. We can rely on IC to stay on top of industry changes and guide us to services that best suit our requirements.",
    author: "Lori Miranda",
    position: "President / COO",
    company: "Cognizant Communication Corporation",
  },
  {
    text: "RTU Journal has provided a strong platform for global knowledge sharing. Their dedication to supporting academic excellence is unmatched and inspiring for the next generation of researchers.",
    author: "Dr. Asadbek Karimov",
    position: "Research Professor",
    company: "RTU University",
  },
  {
    text: "This journal connects researchers from all over the world and creates a professional environment for innovation and collaboration. A truly remarkable initiative.",
    author: "Prof. Nilufar Akhmedova",
    position: "Editor-in-Chief",
    company: "Uzbek Science Association",
  },
];

const HomeTextCarusel = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // 👇 Horizontal scroll yo‘q qiluvchi classlar qo‘shildi
    <section className="flex flex-col items-center h-[450px] justify-center py-12 px-4 md:px-10 bg-gradient-to-b from-white to-[#f5f8ff] overflow-hidden">
      <div className="relative w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/80 shadow-lg backdrop-blur-md border border-indigo-100 rounded-2xl p-6 md:p-8">
              <CardContent>
                <p className="text-base md:text-lg text-gray-700 italic leading-relaxed">
                  “{testimonials[index].text}”
                </p>
                <div className="mt-5 text-right">
                  <h4 className="text-[#133654] font-semibold">
                    {testimonials[index].author}
                  </h4>
                  <p className="text-sm text-[#1d4b73]/80">
                    {testimonials[index].position} —{" "}
                    {testimonials[index].company}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* 👇 Tugmalar endi konteyner ichida qoladi */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-[-50px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="rounded-full bg-[#133654]/10 hover:bg-[#133654]/30 text-[#133654] transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-[-50px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="rounded-full bg-[#133654]/10 hover:bg-[#133654]/30 text-[#133654] transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Indikatorlar */}
      <div className="flex gap-2 mt-6">
        {testimonials.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === index ? 24 : 12,
              backgroundColor: i === index ? "#1d4b73" : "#cbd5e1",
            }}
            className="h-2 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    </section>
  );
};

export default HomeTextCarusel;
