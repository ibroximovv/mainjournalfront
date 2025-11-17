import { Card } from "@/components/ui/card";
import { Users, FileText, BookOpen, User } from "lucide-react"; 
import informationImage from "../assets/images/information.png";
import React from "react";

interface InfoCard {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const infoCards: InfoCard[] = [
  { title: "Journals", count: 2, icon: <BookOpen className="w-10 h-10 text-white" /> },
  { title: "Articles", count: 234, icon: <FileText className="w-10 h-10 text-white" /> },
  { title: "Members", count: 3934, icon: <Users className="w-10 h-10 text-white" /> },
  { title: "Authors", count: 134, icon: <User className="w-10 h-10 text-white" /> },
];

const InformationHome = () => {
  return (
    <section className="w-full py-16 px-4 md:px-10 bg-gradient-to-b from-white to-[#f5f8ff]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12">

        {/* Left: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full">
          {infoCards.map((card, idx) => (
            <Card
              key={idx}
              className="flex flex-col items-center justify-center p-6 rounded-2xl 
                         hover:scale-105 transition-transform duration-300 ease-in-out text-center"
            >
              {/* Icon */}
              <div className="p-3 rounded-full bg-[#133654] mb-3 flex items-center justify-center">
                {card.icon}
              </div>
              
              {/* Data */}
              <h2 className="text-2xl font-bold text-[#133654] mb-1">{card.count}</h2>
              
              {/* Title */}
              <p className="text-base text-gray-600">{card.title}</p>
            </Card>
          ))}
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex justify-center md:justify-end w-full">
          <img
            src={informationImage}
            alt="Information"
            className="rounded-2xl w-full max-w-[450px] h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default InformationHome;
