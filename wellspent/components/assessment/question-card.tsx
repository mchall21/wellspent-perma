"use client";

import { DualSlider } from "./dual-slider";
import { Question, Response } from "@/lib/hooks/use-assessment";

type QuestionCardProps = {
  question: Question;
  responses: Response[];
  onPersonalResponseChange: (questionId: string, score: number) => void;
  onWorkResponseChange: (questionId: string, score: number) => void;
};

export function QuestionCard({
  question,
  responses,
  onPersonalResponseChange,
  onWorkResponseChange,
}: QuestionCardProps) {
  // Debug the question structure
  console.log("Question data:", question);

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