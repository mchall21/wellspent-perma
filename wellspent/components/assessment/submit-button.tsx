"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Response } from "@/lib/hooks/use-assessment";

type SubmitButtonProps = {
  responses: Response[];
  onSubmit: () => Promise<void>;
  disabled?: boolean;
};

export function SubmitButton({
  responses,
  onSubmit,
  disabled = false,
}: SubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={disabled || isSubmitting}
      className="w-full md:w-auto"
    >
      {isSubmitting ? "Submitting..." : "Submit Assessment"}
    </Button>
  );
} 