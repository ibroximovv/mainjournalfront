import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, BookOpen, FileText, ArrowRight } from "lucide-react";
import bg2 from "../../assets/images/bg-rtu2.jpg";
import HomeTextCarusel from "@/components/HomeTextCarusel";
import InformationHome from "@/modules/InformationHome";
import LastJournal from "@/modules/LastJournal";

interface Journal {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  abstract: string;
  publishedDate: string;
  issn: string;
  doi: string;
  webSiteUrl: string;
  journalFileUrl: string;
  isActive: boolean;
  userId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [featuredJournal, setFeaturedJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJournal();
  }, []);

  const fetchFeaturedJournal = async () => {
    try {
      const response = await fetch(
        "https://backendjournal.ilyosbekibroximov.uz/api/journal?page=1&limit=1&sortBy=createdAt&sortOrder=desc"
      );
      const data = await response.json();
      
      if (data.statusCode === 200 && data.data && data.data.length > 0) {
        setFeaturedJournal(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching featured journal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalClick = () => {
    if (featuredJournal) {
      navigate(`/journal/${featuredJournal.id}`);
    }
  };

  const handleExploreClick = () => {
    if (featuredJournal) {
      navigate(`/journal/${featuredJournal.id}`);
    }
  };

  return (
    <>
      <section className="relative w-full mx-auto overflow-hidden">
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
            Explore innovative research, scientific articles, and publications
            from RTU scholars.
          </motion.p>

          <motion.button
            onClick={handleExploreClick}
            disabled={loading || !featuredJournal}
            className="mt-8 px-8 py-3 bg-[#133654] hover:bg-[#1b4b78] text-white rounded-full text-lg font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Loading..." : "Explore Journals"}
          </motion.button>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#133654]/90 to-transparent"></div>
      </section>

      <HomeTextCarusel />
      <InformationHome />

      {/* Featured Journal Section */}
      {!loading && featuredJournal && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Journal
            </h2>
            <p className="text-gray-600">
              Discover our latest scientific publication
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            onClick={handleJournalClick}
            className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="grid md:grid-cols-5 gap-0">
              {/* Image Section */}
              <div className="md:col-span-2 relative h-64 md:h-auto">
                <img
                  src={featuredJournal.imageUrl}
                  alt={featuredJournal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#133654] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Latest Publication
                </div>
              </div>

              {/* Content Section */}
              <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {featuredJournal.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {featuredJournal.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-[#133654]" />
                      <span className="text-sm">
                        {new Date(
                          featuredJournal.publishedDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {featuredJournal.issn && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="w-5 h-5 text-[#133654]" />
                        <span className="text-sm">
                          ISSN: {featuredJournal.issn}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-5 h-5 text-[#133654]" />
                      <span className="text-sm">
                        Volume {featuredJournal.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Click to view full details
                  </span>
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#133654] text-white rounded-lg font-semibold hover:bg-[#1b4b78] transition-colors group">
                    View Journal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {loading && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 h-64 md:h-96 bg-gray-300"></div>
              <div className="md:col-span-3 p-8 md:p-10 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="flex gap-4 pt-4">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <LastJournal />
    </>
  );
};

export default Home;