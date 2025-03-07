"use client";

type SliderLabelProps = {
  value: number;
  min: number;
  max: number;
  labels: string[];
};

export function SliderLabel({ value, min, max, labels }: SliderLabelProps) {
  // For simplicity, we'll just show the start and end labels
  const startLabel = labels[0];
  const endLabel = labels[labels.length - 1];
  
  return (
    <div className="flex justify-between items-center w-full mt-2">
      <div className="text-xs text-muted-foreground">{startLabel}</div>
      <div className="text-sm font-medium">{value}</div>
      <div className="text-xs text-muted-foreground">{endLabel}</div>
    </div>
  );
} 