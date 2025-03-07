import React from "react";
import { Slider } from "@/components/ui/slider";

interface EnhancedSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  startLabel: string;
  endLabel: string;
  startEmoji?: string;
  endEmoji?: string;
  onValueChange: (value: number) => void;
  className?: string;
  colorScheme?: "blue" | "violet" | "green" | "amber" | "red";
}

export function EnhancedSlider({
  value,
  min = 0,
  max = 10,
  step = 1,
  startLabel,
  endLabel,
  startEmoji = "😔",
  endEmoji = "😊",
  onValueChange,
  className,
  colorScheme = "blue"
}: EnhancedSliderProps) {
  // Map color schemes to gradient classes
  const colorMap = {
    blue: "from-blue-200 via-blue-100 to-blue-50",
    violet: "from-violet-200 via-violet-100 to-violet-50",
    green: "from-green-200 via-green-100 to-green-50",
    amber: "from-amber-200 via-amber-100 to-amber-50",
    red: "from-red-200 via-red-100 to-red-50"
  };
  
  const textColorMap = {
    blue: "text-blue-700",
    violet: "text-violet-700",
    green: "text-green-700",
    amber: "text-amber-700",
    red: "text-red-700"
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div 
        className={`h-2 rounded-full bg-gradient-to-r ${colorMap[colorScheme]} relative mb-6`}
      >
        {/* Custom track with colored markers */}
        <div className="absolute -top-1 left-0 w-full flex justify-between">
          <div className="h-4 w-1 bg-red-400 rounded-full"></div>
          <div className="h-3 w-1 bg-red-300 rounded-full hidden sm:block"></div>
          <div className="h-3 w-1 bg-orange-300 rounded-full hidden md:block"></div>
          <div className="h-4 w-1 bg-yellow-400 rounded-full"></div>
          <div className="h-3 w-1 bg-yellow-300 rounded-full hidden sm:block"></div>
          <div className="h-3 w-1 bg-green-300 rounded-full hidden md:block"></div>
          <div className="h-4 w-1 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <Slider 
        value={[value]}
        min={min}
        max={max}
        step={step}
        className="py-4" 
        onValueChange={(values) => onValueChange(values[0])}
      />
      
      <div className="flex justify-between text-sm">
        <div className="flex flex-col items-center">
          <span className="text-2xl">{startEmoji}</span>
          <span className={`text-xs mt-1 ${textColorMap[colorScheme]}`}>{startLabel}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">{endEmoji}</span>
          <span className={`text-xs mt-1 ${textColorMap[colorScheme]}`}>{endLabel}</span>
        </div>
      </div>
    </div>
  );
} 