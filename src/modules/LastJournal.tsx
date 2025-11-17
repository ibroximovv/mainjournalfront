import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import journalbg from "../assets/images/journal-bg.jpg"

interface Journal {
    id: number;
    title: string;
    author: string;
    image?: string;
}

const lastJournals: Journal[] = [
    { id: 1, title: "Quantum Physics Today", author: "Turusnova M.B, Xushvaqtov O.A", image: journalbg },
    { id: 2, title: "Advanced AI Research", author: "Karimova S.D, Kamoljonov B.M", image: journalbg },
    { id: 3, title: "Modern Mathematics", author: "Tursunov J.", image: journalbg },
    { id: 4, title: "Environmental Science", author: "Murodova L.", image: journalbg },
];

const LastJournal = () => {
    return (
        <section className="w-full py-8 md:py-16 px-3 md:px-10 bg-gradient-to-br from-[#f5f8ff] to-[#e8f0fe]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#133654] mb-6 md:mb-12 text-center">
                    What's new
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {lastJournals.map((journal) => (
                        <Card
                            key={journal.id}
                            className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-none"
                        >
                            <div className="flex items-center gap-3 md:gap-6 p-4 md:p-6">
                                {/* Rasm */}
                                <div className="flex-shrink-0">
                                    {journal.image ? (
                                        <img
                                            src={journal.image}
                                            alt={journal.title}
                                            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-xl md:rounded-2xl shadow-md"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#133654] to-[#2563eb] rounded-xl md:rounded-2xl flex items-center justify-center shadow-md">
                                            <BookOpen className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Matn qismi */}
                                <div className="flex-grow min-w-0">
                                    <h2 className="text-base md:text-lg lg:text-xl font-bold text-[#133654] mb-1 md:mb-2 line-clamp-2">
                                        {journal.title}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-600 flex items-start gap-1.5 md:gap-2">
                                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#133654] rounded-full mt-1 flex-shrink-0"></span>
                                        <span className="line-clamp-2">{journal.author}</span>
                                    </p>
                                </div>

                                {/* Icon button */}
                                <div className="flex-shrink-0">
                                    <button className="p-2.5 md:p-3 lg:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#133654] to-[#2563eb] hover:from-[#2563eb] hover:to-[#133654] transition-all duration-300 shadow-lg hover:shadow-xl group">
                                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LastJournal;