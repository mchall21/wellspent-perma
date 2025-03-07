"use client";

import { colorMap } from "@/lib/utils/chart-utils";

type ScoreCardProps = {
  dimension: string;
  dimensionName: string;
  personal: number;
  work: number;
  color?: string;
};

export function ScoreCard({
  dimension,
  dimensionName,
  personal,
  work,
  color
}: ScoreCardProps) {
  // Use the color from props or fall back to the color map
  const cardColor = color || colorMap[dimension] || "#333";
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div 
        className="p-4 text-white font-semibold"
        style={{ backgroundColor: cardColor }}
      >
        {dimensionName}
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Personal</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${personal * 10}%`,
                  backgroundColor: cardColor
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{personal}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Work</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${work * 10}%`,
                  backgroundColor: cardColor
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{work}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 