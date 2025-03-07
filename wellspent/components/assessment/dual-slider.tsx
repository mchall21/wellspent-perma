"use client";

import { Slider } from "@/components/ui/slider";
import { SliderLabel } from "./slider-label";

type DualSliderProps = {
  personalQuestion: string;
  workQuestion: string;
  personalValue: number;
  workValue: number;
  onPersonalChange: (value: number) => void;
  onWorkChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
};

export function DualSlider({
  personalQuestion,
  workQuestion,
  personalValue,
  workValue,
  onPersonalChange,
  onWorkChange,
  min = 0,
  max = 10,
  step = 1,
  labels = ["Never", "Always"],
}: DualSliderProps) {
  const handlePersonalChange = (value: number[]) => {
    onPersonalChange(value[0]);
  };

  const handleWorkChange = (value: number[]) => {
    onWorkChange(value[0]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">{personalQuestion}</h3>
          <span className="text-lg font-semibold">{personalValue}</span>
        </div>
        <Slider
          value={[personalValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handlePersonalChange}
          className="py-4"
        />
        <SliderLabel value={personalValue} min={min} max={max} labels={labels} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">{workQuestion}</h3>
          <span className="text-lg font-semibold">{workValue}</span>
        </div>
        <Slider
          value={[workValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleWorkChange}
          className="py-4"
        />
        <SliderLabel value={workValue} min={min} max={max} labels={labels} />
      </div>
    </div>
  );
} 