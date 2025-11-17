import { motion } from "framer-motion";
import bg2 from "../../assets/images/bg-rtu2.jpg";
import HomeTextCarusel from "@/components/HomeTextCarusel";
import InformationHome from "@/modules/InformationHome";
import LastJournal from "@/modules/LastJournal";

const Home = () => {
  return (
    <>
      <section className="relative w-full mx-auto overflow-hidden top-">
        {/* Background image */}
        <div className="w-full h-[600px]">
          <img
            src={bg2}
            alt="RTU Journal background"
            className="w-full h-full object-cover brightness-[0.55]"
          />
        </div>

        {/* Overlay text */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-wide mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            RTU Scientific Journal
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl max-w-2xl text-center text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Explore innovative research, scientific articles, and publications from RTU scholars.
          </motion.p>

          <motion.button
            className="mt-8 px-8 py-3 bg-[#133654] hover:bg-[#1b4b78] text-white rounded-full text-lg font-medium shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Articles
          </motion.button>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#133654]/90 to-transparent"></div>
      </section>
      <HomeTextCarusel />
      <InformationHome />
      <LastJournal />
    </>
  );
};

export default Home;