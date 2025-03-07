"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dimensionMap, colorMap } from "@/lib/utils/chart-utils";

export default function PermaVPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">The PERMA-V Model</h1>
          <p className="text-muted-foreground">
            Understanding the six dimensions of well-being that form the foundation of our assessment
          </p>
        </div>

        <div className="prose max-w-none">
          <p>
            The PERMA-V model is an extension of Martin Seligman's PERMA model of well-being, with the addition of Vitality as a sixth dimension. This framework provides a comprehensive approach to understanding and measuring well-being across different aspects of life.
          </p>
          <p>
            Our assessment measures each of these dimensions in both your personal and work life, helping you identify areas of strength and opportunities for growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4" style={{ borderLeftColor: colorMap['P'] }}>
            <CardHeader>
              <CardTitle>Positive Emotions</CardTitle>
              <CardDescription>Experiencing positive feelings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This dimension focuses on the extent to which you experience positive emotions such as joy, gratitude, hope, and contentment in your daily life. Positive emotions contribute to resilience and can broaden your perspective.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Frequency of positive emotions</li>
                  <li>Ability to savor positive experiences</li>
                  <li>Optimism and positive outlook</li>
                  <li>Gratitude and appreciation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderLeftColor: colorMap['E'] }}>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
              <CardDescription>Being absorbed in activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Engagement refers to the experience of flow – being completely absorbed and focused on what you're doing. When engaged, you lose track of time and feel energized by the activity itself.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Flow experiences</li>
                  <li>Using your strengths</li>
                  <li>Interest and curiosity</li>
                  <li>Challenging activities that match your skills</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderLeftColor: colorMap['R'] }}>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
              <CardDescription>Connecting with others</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Positive relationships are essential for well-being. This dimension measures the quality of your connections with others, including feelings of love, support, and belonging.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Quality of close relationships</li>
                  <li>Social support networks</li>
                  <li>Sense of belonging</li>
                  <li>Giving and receiving care</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderLeftColor: colorMap['M'] }}>
            <CardHeader>
              <CardTitle>Meaning</CardTitle>
              <CardDescription>Having purpose and direction</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Meaning involves having a sense of purpose and feeling that your life matters. This dimension assesses the extent to which you feel your activities contribute to something larger than yourself.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sense of purpose</li>
                  <li>Connection to something larger</li>
                  <li>Values alignment</li>
                  <li>Making a difference</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderLeftColor: colorMap['A'] }}>
            <CardHeader>
              <CardTitle>Accomplishment</CardTitle>
              <CardDescription>Achieving goals and mastery</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Accomplishment refers to the pursuit and achievement of meaningful goals. This dimension measures your sense of competence, progress, and mastery in various areas of life.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Goal setting and achievement</li>
                  <li>Sense of progress</li>
                  <li>Mastery and skill development</li>
                  <li>Perseverance and grit</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderLeftColor: colorMap['V'] }}>
            <CardHeader>
              <CardTitle>Vitality</CardTitle>
              <CardDescription>Physical and mental energy</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Vitality is the addition to the original PERMA model, focusing on physical and mental energy. This dimension assesses your health habits, energy levels, and overall physical well-being.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key aspects:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Energy levels</li>
                  <li>Sleep quality</li>
                  <li>Physical activity</li>
                  <li>Nutrition and health habits</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="prose max-w-none">
          <h2>Balancing Personal and Work Well-being</h2>
          <p>
            Our assessment measures each dimension in both your personal and work life, recognizing that well-being can vary across different domains. This dual approach helps you identify:
          </p>
          <ul>
            <li>Areas where you're thriving in both personal and work contexts</li>
            <li>Dimensions that may be strong in one domain but need attention in another</li>
            <li>Opportunities to transfer strengths from one area to another</li>
            <li>Overall balance between your personal and work well-being</li>
          </ul>
          <p>
            By understanding your well-being profile across these dimensions, you can make targeted changes to improve your overall quality of life and work satisfaction.
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 