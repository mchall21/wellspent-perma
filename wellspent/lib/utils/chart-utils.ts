import { Database } from "@/lib/database-types";

type AssessmentResponse = Database["public"]["Tables"]["assessment_responses"]["Row"] & {
  assessment_questions: Database["public"]["Tables"]["assessment_questions"]["Row"];
};

// Define the PERMA-V dimensions
export const dimensions = [
  { key: "P", name: "Positive Emotion", color: "#FF6384" },
  { key: "E", name: "Engagement", color: "#36A2EB" },
  { key: "R", name: "Relationships", color: "#FFCE56" },
  { key: "M", name: "Meaning", color: "#4BC0C0" },
  { key: "A", name: "Accomplishment", color: "#9966FF" },
  { key: "V", name: "Vitality", color: "#FF9F40" }
];

// Map dimension keys to full names
export const dimensionMap: Record<string, string> = dimensions.reduce(
  (acc, dim) => ({ ...acc, [dim.key]: dim.name }),
  {}
);

// Map dimension keys to colors
export const colorMap: Record<string, string> = dimensions.reduce(
  (acc, dim) => ({ ...acc, [dim.key]: dim.color }),
  {}
);

// Calculate average scores for each dimension
export function calculateDimensionScores(responses: AssessmentResponse[]) {
  // Initialize scores object
  const scores: Record<string, { personal: number; work: number; count: number }> = {};
  
  // Initialize with all dimensions
  dimensions.forEach(dim => {
    scores[dim.key] = { personal: 0, work: 0, count: 0 };
  });
  
  // Sum up scores for each dimension
  responses.forEach(response => {
    const category = response.assessment_questions.category;
    if (category && scores[category]) {
      scores[category].personal += response.personal_score;
      scores[category].work += response.work_score;
      scores[category].count += 1;
    }
  });
  
  // Calculate averages
  const averages = dimensions.map(dim => {
    const score = scores[dim.key];
    const count = score.count || 1; // Avoid division by zero
    return {
      dimension: dim.key,
      dimensionName: dim.name,
      personal: Math.round((score.personal / count) * 10) / 10,
      work: Math.round((score.work / count) * 10) / 10,
      color: dim.color
    };
  });
  
  return averages;
}

// Format data for bar chart
export function formatBarChartData(dimensionScores: ReturnType<typeof calculateDimensionScores>) {
  return dimensionScores.map(score => ({
    name: score.dimensionName,
    personal: score.personal,
    work: score.work,
    color: score.color
  }));
}

// Format data for radar chart
export function formatRadarChartData(dimensionScores: ReturnType<typeof calculateDimensionScores>) {
  // For radar chart, we need to transform the data into two separate datasets
  const personalData = dimensionScores.map(score => ({
    subject: score.dimensionName,
    value: score.personal,
    fullMark: 10
  }));
  
  const workData = dimensionScores.map(score => ({
    subject: score.dimensionName,
    value: score.work,
    fullMark: 10
  }));
  
  return [
    { name: "Personal", data: personalData, color: "#8884d8" },
    { name: "Work", data: workData, color: "#82ca9d" }
  ];
}

// Calculate overall scores
export function calculateOverallScores(dimensionScores: ReturnType<typeof calculateDimensionScores>) {
  const personalTotal = dimensionScores.reduce((sum, score) => sum + score.personal, 0);
  const workTotal = dimensionScores.reduce((sum, score) => sum + score.work, 0);
  
  return {
    personal: Math.round((personalTotal / dimensionScores.length) * 10) / 10,
    work: Math.round((workTotal / dimensionScores.length) * 10) / 10
  };
}

// Generate insights based on scores
export function generateInsights(dimensionScores: ReturnType<typeof calculateDimensionScores>) {
  const insights: { dimension: string; text: string; type: 'strength' | 'opportunity' | 'balance' }[] = [];
  
  // Find highest and lowest scores
  let highestPersonal = { dimension: '', score: 0 };
  let lowestPersonal = { dimension: '', score: 10 };
  let highestWork = { dimension: '', score: 0 };
  let lowestWork = { dimension: '', score: 10 };
  
  dimensionScores.forEach(score => {
    if (score.personal > highestPersonal.score) {
      highestPersonal = { dimension: score.dimensionName, score: score.personal };
    }
    if (score.personal < lowestPersonal.score) {
      lowestPersonal = { dimension: score.dimensionName, score: score.personal };
    }
    if (score.work > highestWork.score) {
      highestWork = { dimension: score.dimensionName, score: score.work };
    }
    if (score.work < lowestWork.score) {
      lowestWork = { dimension: score.dimensionName, score: score.work };
    }
  });
  
  // Add insights for personal strengths and opportunities
  if (highestPersonal.score >= 7) {
    insights.push({
      dimension: highestPersonal.dimension,
      text: `Your personal life shows strength in ${highestPersonal.dimension} with a score of ${highestPersonal.score}/10.`,
      type: 'strength'
    });
  }
  
  if (lowestPersonal.score <= 5) {
    insights.push({
      dimension: lowestPersonal.dimension,
      text: `There's an opportunity to improve ${lowestPersonal.dimension} in your personal life, currently at ${lowestPersonal.score}/10.`,
      type: 'opportunity'
    });
  }
  
  // Add insights for work strengths and opportunities
  if (highestWork.score >= 7) {
    insights.push({
      dimension: highestWork.dimension,
      text: `Your work life shows strength in ${highestWork.dimension} with a score of ${highestWork.score}/10.`,
      type: 'strength'
    });
  }
  
  if (lowestWork.score <= 5) {
    insights.push({
      dimension: lowestWork.dimension,
      text: `There's an opportunity to improve ${lowestWork.dimension} in your work life, currently at ${lowestWork.score}/10.`,
      type: 'opportunity'
    });
  }
  
  // Add insights for balance/imbalance between personal and work
  dimensionScores.forEach(score => {
    const difference = Math.abs(score.personal - score.work);
    if (difference >= 3) {
      const higher = score.personal > score.work ? 'personal' : 'work';
      insights.push({
        dimension: score.dimensionName,
        text: `There's a significant difference in ${score.dimensionName} between your ${higher} life (${higher === 'personal' ? score.personal : score.work}/10) and ${higher === 'personal' ? 'work' : 'personal'} life (${higher === 'personal' ? score.work : score.personal}/10).`,
        type: 'balance'
      });
    }
  });
  
  return insights;
} 