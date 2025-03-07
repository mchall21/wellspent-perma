"use client";

import { DualSlider } from "./dual-slider";
import { COMPONENT_TYPES, getQuestionComponent } from "@/lib/question-mapping";

type QuestionCardProps = {
  question: any;
  responses: any[];
  onPersonalResponseChange: (questionId: string, score: number) => void;
  onWorkResponseChange: (questionId: string, score: number) => void;
};

export function QuestionCard({
  question,
  responses,
  onPersonalResponseChange,
  onWorkResponseChange,
}: QuestionCardProps) {
  const response = responses.find(
    (r) => r.questionId === question.id
  );

  const personalValue = response?.personalScore || 0;
  const workValue = response?.workScore || 0;

  const handlePersonalChange = (value: number) => {
    onPersonalResponseChange(question.id, value);
  };

  const handleWorkChange = (value: number) => {
    onWorkResponseChange(question.id, value);
  };

  // Default values in case properties are missing
  const text = question.text || "";
  const personalLabel = question.personal_context_label || "In your personal life";
  const workLabel = question.work_context_label || "At work";
  const scaleStart = question.scale_start || 0;
  const scaleEnd = question.scale_end || 10;
  const startLabel = question.scale_start_label || "Low";
  const endLabel = question.scale_end_label || "High";
  
  // For the quick implementation, just use the default component
  // You can expand this with more components later
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {text}
        </h2>
      </div>

      <DualSlider
        personalQuestion={personalLabel}
        workQuestion={workLabel}
        personalValue={personalValue}
        workValue={workValue}
        onPersonalChange={handlePersonalChange}
        onWorkChange={handleWorkChange}
        min={scaleStart}
        max={scaleEnd}
        step={1}
        labels={[startLabel, endLabel]}
      />
    </div>
  );
} 