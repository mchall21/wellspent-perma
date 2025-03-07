// Map of component types to their React component implementations
export const COMPONENT_TYPES = {
  DEFAULT: "default",           // Standard dual slider component
  JOY: "joy",                   // Emoji-based rating for joy/contentment
  OPTIMISM: "optimism",         // Mountain climber visualization
  FLOW: "flow",                 // Clock visualization for time perception
  ABSORPTION: "absorption",     // Water fill for engagement level
  SOCIAL_SUPPORT: "social_support", // Network visualization
  CONNECTION: "connection",     // Connection strength visualization
  PURPOSE: "purpose",           // Compass visualization
  CONTRIBUTION: "contribution", // Ripple effect visualization
  GOALS: "goals",               // Mountain path with checkpoints
  COMPETENCE: "competence",     // Skill level meters
  ENERGY: "energy",             // Battery visualization
  WELLBEING: "wellbeing",       // Health gauges visualization
  GRATITUDE: "gratitude",       // Balance scale visualization
  FLOW_CHANNEL: "flow_channel", // Flow channel diagram
  SAFETY: "safety",             // Shield visualization
  VALUES: "values",             // Value compass
  GROWTH: "growth",             // Growth spiral
  BALANCE: "balance",           // Seesaw visualization
  SOCIAL_CONNECTION: "social_connection", // Network visualization
  IMPACT: "impact"              // Tree growth visualization
};

// Function to get the appropriate component for a question
export function getQuestionComponent(questionId: string, category: string) {
  // For the quick implementation, just return default
  // You can expand this mapping later as needed
  return COMPONENT_TYPES.DEFAULT;
} 