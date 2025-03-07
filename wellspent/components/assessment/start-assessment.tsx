"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StartAssessment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      // Use window.location for more reliable navigation
      window.location.href = "/assessment/questions";
    } catch (error) {
      console.error("Error starting assessment:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PERMA-V Assessment</h1>
        <p className="text-muted-foreground">
          Assess your well-being using the PERMA-V framework
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">About This Assessment</h2>
        <p>
          The PERMA-V model is a framework for understanding well-being developed by Dr. Martin Seligman. 
          It consists of six elements that contribute to overall well-being:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>P</strong>ositive Emotion: Feeling good, experiencing joy, happiness, and contentment</li>
          <li><strong>E</strong>ngagement: Being fully absorbed in activities that use your skills and challenge you</li>
          <li><strong>R</strong>elationships: Having positive relationships with others</li>
          <li><strong>M</strong>eaning: Having a sense of purpose and meaning in life</li>
          <li><strong>A</strong>ccomplishment: Having a sense of achievement and success</li>
          <li><strong>V</strong>itality: Physical and mental health and well-being</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <p>
          This assessment will ask you a series of questions about your personal life and work life.
          For each question, you'll rate your experience on a scale from 0 to 10.
        </p>
        <p>
          The assessment takes approximately 10-15 minutes to complete. Your responses will be used to
          generate a personalized well-being profile.
        </p>
      </div>

      <Button onClick={handleStart} disabled={isLoading} className="w-full md:w-auto bg-green-600 hover:bg-green-700">
        {isLoading ? "Loading..." : "Start Assessment"}
      </Button>
    </div>
  );
} 