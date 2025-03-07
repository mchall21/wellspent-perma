"use client";

import { ScoreCard } from "./score-card";

type ScoreComparisonProps = {
  scores: {
    dimension: string;
    dimensionName: string;
    personal: number;
    work: number;
    color: string;
  }[];
};

export function ScoreComparison({ scores }: ScoreComparisonProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dimension Scores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((score) => (
          <ScoreCard
            key={score.dimension}
            dimension={score.dimension}
            dimensionName={score.dimensionName}
            personal={score.personal}
            work={score.work}
            color={score.color}
          />
        ))}
      </div>
    </div>
  );
} 