import React, { useEffect, useState } from "react";
import stepsData from "../data/HowItWorksData";

function HowItWorks() {
  const [isVisible, setIsVisible] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll(".step-item");
      const newVisibility = Array.from(stepElements).map((element) => {
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
    <div className="w-full h-full bg-indigo-800 rounded-2xl overflow-hidden" id="How it Works?">
      <section className="p-8 md:p-16 mb-6">
        <h3 className="text-xl md:text-2xl mb-4 md:mb-8 text-white">
          How It Works?
        </h3>
        <h1 className="text-3xl md:text-6xl font-bold mt-4 text-white">
          Simple, Secure and Fun
        </h1>
      </section>
      <section className="w-full h-full flex flex-col">
        {stepsData.map((step, index) => (
          <div
            key={index}
            className={`step-item grid grid-cols-1 md:grid-cols-2 items-center p-8 md:p-16 gap-6 transition-all duration-700 ease-in-out ${
              isVisible[index]
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[-50px]"
            } ${index % 2 === 0 ? "bg-indigo-900" : "bg-indigo-800"}`}
          >
            <div className="flex items-center gap-4 w-full text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-white animate-bounce">
                {step.step}
              </div>
              <h2 className="text-xl md:text-3xl font-semibold text-white">
                {step.title}
              </h2>
            </div>
            <p className="text-base md:text-2xl text-gray-300 mt-4 md:mt-0">
              {step.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HowItWorks;
