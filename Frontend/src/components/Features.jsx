import React from "react";
import FeaturesData from "../data/FeaturesData";

const Features = () => {
  return (
    <>
    <h1 className="text-6xl font-bold text-center pt-8">Features</h1>
    <div className="mx-auto max-w-[1142px]">
      <div className="flex flex-wrap items-start py-12 gap-6">
        {FeaturesData.map((feature, index) => (
          <div
            key={index}
            className="flex-[calc(33.333%-30px)] overflow-hidden rounded-[28px]"
          >
            <div className="block relative p-8 bg-gray-900 hover:text-white">
              <div className="absolute top-[-75px] right-[-75px] h-[150px] w-[150px] bg-indigo-800 rounded-full transition-transform duration-500 hover:scale-[20]"></div>
              <div className="relative z-10 min-h-[87px] mb-6 text-2xl font-bold text-white">
                {feature.title}
              </div>
              <div className="relative z-10 text-lg text-white">
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
