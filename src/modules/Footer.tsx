import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from '../assets/rtu-logo.svg'

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#0a1f35] via-[#133654] to-[#1a4a6f] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16"
      >
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <img src={logo} alt="Renessans TU Logo" className="rounded-full w-[140px] h-[140px] mb-4 border border-white/20" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Zamonaviy ta'lim standartlari va innovatsion yondashuvlar bilan kelajak kadrlarini tayyorlaymiz.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-400 pl-3">Tezkor havolalar</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Biz haqimizda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Jurnallar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Maqolalar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Yangiliklar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Kontakt</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-400 pl-3">Aloqa ma'lumotlari</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    Toshkent shahar, Shayxontohur tumani,<br />
                    Samarqand darvoza ko'chasi, Charxnovza 17
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    Toshkent shahri, Chilonzor tumani,<br />
                    Lutfiy ko'chasi 47-uy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+998555067007" className="text-gray-300 hover:text-blue-400 transition-colors">
                  +998 55 506 7007
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info-rtu@renessans-edu.uz" className="text-gray-300 hover:text-blue-400 transition-colors break-all">
                  info-rtu@renessans-edu.uz
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-white/10 pt-8 pb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Yangiliklar obunasi</h3>
              <p className="text-gray-400 text-sm">Universitet yangiliklaridan xabardor bo'ling</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Email manzilingiz"
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 backdrop-blur-sm flex-1 md:w-64"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 whitespace-nowrap">
                Obuna bo'lish
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p>&copy; 2025 Renessans Ta'lim Universiteti. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Foydalanish shartlari</a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;