"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dimensionMap, colorMap } from "@/lib/utils/chart-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TipsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  const tips: Record<string, { personal: string[], work: string[] }> = {
    P: {
      personal: [
        "Practice gratitude by writing down three things you're thankful for each day",
        "Engage in activities that bring you joy, even if just for a few minutes daily",
        "Savor positive experiences by taking time to fully enjoy and reflect on them",
        "Limit exposure to negative news and social media that triggers negative emotions",
        "Start a positivity journal to record and celebrate small wins and happy moments"
      ],
      work: [
        "Begin meetings with a brief positive check-in or appreciation moment",
        "Personalize your workspace with items that bring you joy",
        "Take short breaks to reset your mood when feeling stressed",
        "Acknowledge and celebrate team accomplishments, no matter how small",
        "Practice positive self-talk about your work capabilities and contributions"
      ]
    },
    E: {
      personal: [
        "Identify activities that create 'flow' for you and schedule them regularly",
        "Minimize distractions during activities you want to be fully engaged in",
        "Try new hobbies that challenge you at the right level",
        "Set aside dedicated time for deep focus on personal projects",
        "Practice mindfulness to improve your ability to stay present"
      ],
      work: [
        "Break large tasks into focused work sessions with clear goals",
        "Use the Pomodoro technique (25 minutes of focused work, 5-minute break)",
        "Reduce multitasking by closing unnecessary tabs and apps",
        "Schedule your most challenging work during your peak energy hours",
        "Create a dedicated workspace that minimizes interruptions"
      ]
    },
    R: {
      personal: [
        "Schedule regular check-ins with friends and family",
        "Practice active listening by focusing fully on the person speaking",
        "Express appreciation to those close to you",
        "Join groups or clubs aligned with your interests",
        "Be vulnerable and share your authentic self with trusted others"
      ],
      work: [
        "Take time to get to know colleagues beyond work topics",
        "Offer help and support to team members when appropriate",
        "Participate in team-building activities and social events",
        "Practice empathy by considering others' perspectives",
        "Give specific, positive feedback to colleagues regularly"
      ]
    },
    M: {
      personal: [
        "Reflect on your core values and how your actions align with them",
        "Volunteer for causes you care about",
        "Create a personal mission statement",
        "Connect your daily activities to your larger life purpose",
        "Spend time in nature or spiritual practices that provide perspective"
      ],
      work: [
        "Identify how your work contributes to the organization's mission",
        "Connect your tasks to the impact they have on customers or society",
        "Mentor others to share your knowledge and experience",
        "Seek projects that align with your personal values",
        "Reflect on how your work allows you to use your strengths for a purpose"
      ]
    },
    A: {
      personal: [
        "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
        "Break large goals into smaller, manageable steps",
        "Track your progress and celebrate small wins",
        "Learn a new skill or take on a challenging project",
        "Reflect on past accomplishments when facing setbacks"
      ],
      work: [
        "Create clear objectives for your role and projects",
        "Seek regular feedback on your performance",
        "Develop and follow through on professional development plans",
        "Document your achievements for performance reviews",
        "Take on stretch assignments that build new capabilities"
      ]
    },
    V: {
      personal: [
        "Establish a consistent sleep schedule aiming for 7-9 hours",
        "Incorporate physical activity you enjoy into your routine",
        "Stay hydrated and eat nutritious meals",
        "Practice stress-reduction techniques like deep breathing or meditation",
        "Take breaks from screens and digital devices"
      ],
      work: [
        "Take short movement breaks throughout the workday",
        "Use ergonomic furniture and proper posture",
        "Step outside for fresh air and natural light when possible",
        "Keep healthy snacks available at your workspace",
        "Set boundaries between work and personal time to prevent burnout"
      ]
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Well-being Tips</h1>
          <p className="text-muted-foreground">
            Practical strategies to improve your well-being across the six dimensions of PERMA-V
          </p>
        </div>

        <div className="prose max-w-none mb-8">
          <p>
            Based on your assessment results, you may want to focus on specific dimensions where your scores were lower. 
            Below are evidence-based strategies for enhancing each dimension in both personal and work contexts.
          </p>
          <p>
            Remember that small, consistent changes often lead to the most sustainable improvements in well-being. 
            Choose one or two strategies to start with rather than trying to implement everything at once.
          </p>
        </div>

        <Tabs defaultValue="P">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            {Object.keys(dimensionMap).map(key => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:border-b-2"
                style={{ borderColor: colorMap[key] }}
              >
                {dimensionMap[key]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(dimensionMap).map(key => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4" style={{ borderLeftColor: colorMap[key] }}>
                  <CardHeader>
                    <CardTitle>Personal Life</CardTitle>
                    <CardDescription>
                      Strategies for improving {dimensionMap[key]} in your personal life
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tips[key as keyof typeof tips].personal.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 text-green-500">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4" style={{ borderLeftColor: colorMap[key] }}>
                  <CardHeader>
                    <CardTitle>Work Life</CardTitle>
                    <CardDescription>
                      Strategies for improving {dimensionMap[key]} in your work life
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tips[key as keyof typeof tips].work.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 text-green-500">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Why {dimensionMap[key]} Matters</h3>
                <p className="mb-4">
                  {key === 'P' && "Positive emotions broaden our perspective and build resources for the future. They help us recover from setbacks and approach challenges with resilience."}
                  {key === 'E' && "Engagement creates a sense of flow and immersion that makes activities intrinsically rewarding. It helps us develop skills and find meaning in what we do."}
                  {key === 'R' && "Positive relationships provide social support, a sense of belonging, and opportunities for growth. They are one of the strongest predictors of overall well-being."}
                  {key === 'M' && "Meaning gives us purpose and direction, connecting our actions to something larger than ourselves. It helps us navigate challenges and find fulfillment."}
                  {key === 'A' && "Accomplishment builds confidence, competence, and a sense of progress. It satisfies our need for mastery and contributes to self-efficacy."}
                  {key === 'V' && "Vitality provides the physical and mental energy needed for all other dimensions. It's the foundation that enables us to fully engage with life."}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Remember:</strong> Balance is key. While focusing on areas for improvement, don't neglect dimensions where you're already strong.
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="bg-green-50 border border-green-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Creating Your Well-being Plan</h2>
          <p className="mb-4">
            For the most effective results, create a personalized well-being plan:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Review your assessment results to identify 1-2 priority dimensions</li>
            <li>Select 2-3 strategies from the lists above that resonate with you</li>
            <li>Schedule these activities in your calendar as recurring commitments</li>
            <li>Track your progress and how the activities affect your mood and energy</li>
            <li>Reassess after 4-6 weeks and adjust your plan as needed</li>
          </ol>
          <p className="mt-4">
            Small, consistent actions lead to meaningful improvements over time. Be patient with yourself and celebrate your progress along the way.
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 