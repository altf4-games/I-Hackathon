import React, { useEffect, useState } from "react";
import FeaturesData from "../data/FeaturesData";

const Features = () => {
  const [isVisible, setIsVisible] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const featureElements = document.querySelectorAll(".feature-item");
      const newVisibility = Array.from(featureElements).map((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
      });
      setIsVisible(newVisibility);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on mount to handle already visible items
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <h1 className="text-4xl md:text-6xl font-bold text-center pt-8">
        Features
      </h1>
      <div className="mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {FeaturesData.map((feature, index) => (
            <div
              key={index}
              className={`feature-item overflow-hidden rounded-[28px] bg-gray-900 transition-transform duration-500 ${
                isVisible[index]
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-10"
              }`}
            >
              <div className="relative p-8 hover:text-white">
                <div className="absolute top-[-75px] right-[-75px] h-[150px] w-[150px] bg-indigo-800 rounded-full transition-transform duration-500 hover:scale-[20]"></div>
                <div className="relative z-10 min-h-[87px] mb-6 text-xl md:text-2xl font-bold text-white">
                  {feature.title}
                </div>
                <div className="relative z-10 text-base md:text-lg text-white">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;
