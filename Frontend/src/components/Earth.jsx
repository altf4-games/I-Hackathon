import React, { Suspense } from "react";
import sampleArcs from "../data/SampleArcs";
import globeConfig from "../data/GlobeConfig";

const World = React.lazy(() => import("./ui/globe"));

export function Earth() {
  return (
    <div className="relative overflow-hidden flex justify-center items-center w-full h-full">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <World data={sampleArcs} globeConfig={globeConfig} />
      </Suspense>
    </div>
  );
}
