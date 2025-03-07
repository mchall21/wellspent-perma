"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type NavigationButtonsProps = {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  submissionError?: string | null;
};

export function NavigationButtons({
  onNext,
  onPrevious,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  submissionError,
}: NavigationButtonsProps) {
  return (
    <div className="space-y-4">
      {submissionError && (
        <Alert variant="destructive">
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion || isSubmitting}
        >
          Previous
        </Button>
        
        {isLastQuestion ? (
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        ) : (
          <Button onClick={onNext} disabled={isSubmitting}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
} 