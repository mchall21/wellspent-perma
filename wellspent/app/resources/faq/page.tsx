"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  const faqs = [
    {
      question: "What is the PERMA-V assessment?",
      answer: "The PERMA-V assessment is a tool designed to measure your well-being across six dimensions: Positive emotions, Engagement, Relationships, Meaning, Accomplishment, and Vitality. It evaluates these dimensions in both your personal and work life to provide a comprehensive view of your overall well-being."
    },
    {
      question: "How long does the assessment take?",
      answer: "The assessment typically takes 10-15 minutes to complete. It consists of a series of questions about your experiences in both personal and work contexts."
    },
    {
      question: "How should I interpret my results?",
      answer: "Your results show your scores across the six dimensions of well-being, separated into personal and work contexts. Higher scores (closer to 10) indicate areas of strength, while lower scores may represent opportunities for growth. The insights section provides specific observations based on your score patterns."
    },
    {
      question: "Are my results private?",
      answer: "Yes, your assessment results are private and can only be accessed by you when logged into your account. We take data privacy seriously and do not share your individual results with anyone."
    },
    {
      question: "How often should I take the assessment?",
      answer: "We recommend taking the assessment every 1-3 months to track changes in your well-being over time. This frequency allows enough time for any changes you implement to have an effect, while still providing regular check-ins on your progress."
    },
    {
      question: "What should I do with my results?",
      answer: "After reviewing your results, we encourage you to reflect on what they mean for you personally. The reflection page helps you document your thoughts and create action plans. Focus on both leveraging your strengths and addressing areas with lower scores. Small, consistent changes often lead to meaningful improvements in well-being."
    },
    {
      question: "Can I compare my results with others?",
      answer: "The assessment is designed for personal growth rather than comparison with others. Everyone's well-being profile is unique, and what matters most is your own progress over time rather than how you compare to others."
    },
    {
      question: "What if I have very different scores for personal and work life?",
      answer: "It's common to have different scores across personal and work contexts. This can highlight areas where you might transfer strategies from one domain to another. For example, if your Relationships score is high in personal life but low at work, consider how you might apply similar connection strategies in your workplace."
    },
    {
      question: "How accurate is the assessment?",
      answer: "The assessment is based on established well-being research and the PERMA-V framework. Its accuracy depends on how honestly you answer the questions. The more truthful your responses, the more valuable the insights will be for your personal growth."
    },
    {
      question: "What if I'm not satisfied with my scores?",
      answer: "Lower scores are not failures but opportunities for growth. The resources section provides strategies for improving each dimension. Remember that well-being is a journey, and small improvements add up over time. If you're concerned about consistently low scores, consider speaking with a mental health professional."
    }
  ];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Common questions about the PERMA-V assessment and how to interpret your results
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-2">
            If you have additional questions about the assessment or how to interpret your results, please contact our support team.
          </p>
          <p className="text-blue-600">
            support@wellspent.com
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 