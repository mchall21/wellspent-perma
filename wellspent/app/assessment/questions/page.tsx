"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  HeartIcon, 
  BriefcaseIcon, 
  UserIcon, 
  UsersIcon,
  ClockIcon,
  ArrowUpIcon,
  ShieldIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";

// Define types
type Context = "personal" | "work";
type ResponseValue = number;

interface Response {
  [questionId: string]: {
    personal?: ResponseValue;
    work?: ResponseValue;
  };
}

interface QuestionComponentProps {
  questionId: string;
}

interface Question {
  id: string;
  category: string;
  text: string;
  component: (props: QuestionComponentProps) => React.ReactElement;
}

export default function AssessmentQuestions() {
  // State to store all responses
  const [responses, setResponses] = useState<Response>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Update response values
  const handleValueChange = (questionId: string, context: Context, value: ResponseValue) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [context]: value
      }
    }));
  };

  // Navigate between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get current response values
  const getValue = (questionId: string, context: Context, defaultValue = 5): number => {
    return responses[questionId]?.[context] ?? defaultValue;
  };

  // Submit the assessment
  const handleSubmit = () => {
    console.log("Assessment responses:", responses);
    alert("Assessment completed! Check console for responses.");
  };

  // All questions with their formats
  const questions: Question[] = [
    // POSITIVE EMOTIONS (P)
    // Question 1: Joy & Contentment
    {
      id: "joy",
      category: "P",
      text: "How often do you experience genuine joy or contentment?",
      component: ({ questionId }: QuestionComponentProps) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center mb-4">
              <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Personal Life</span>
            </div>
            
            <div className="space-y-3">
              <Slider 
                defaultValue={[getValue(questionId, "personal")]} 
                max={10} 
                step={1}
                className="py-4" 
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
              <div className="flex justify-between text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😔</span>
                  <span className="text-xs mt-1 text-blue-700">Rarely</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😊</span>
                  <span className="text-xs mt-1 text-blue-700">Very often</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border p-4 bg-gradient-to-r from-violet-50 to-violet-100">
            <div className="flex items-center mb-4">
              <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
              <span className="font-medium text-violet-800">Work Life</span>
            </div>
            
            <div className="space-y-3">
              <Slider 
                defaultValue={[getValue(questionId, "work")]} 
                max={10} 
                step={1}
                className="py-4" 
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
              <div className="flex justify-between text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😔</span>
                  <span className="text-xs mt-1 text-violet-700">Rarely</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😊</span>
                  <span className="text-xs mt-1 text-violet-700">Very often</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Question 2: Optimism
    {
      id: "optimism",
      category: "P",
      text: "How optimistic are you about your future?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="relative h-40 flex items-center justify-center mb-4">
                {/* Shield visualization */}
                <div className="relative h-32 w-28">
                  <svg viewBox="0 0 100 120" className="h-full w-full">
                    <path 
                      d="M50,0 L100,30 L100,70 Q100,120 50,120 Q0,120 0,70 L0,30 Z" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="6"
                    />
                    <path 
                      d="M50,0 L100,30 L100,70 Q100,120 50,120 Q0,120 0,70 L0,30 Z" 
                      fill={`rgba(37, 99, 235, ${personalValue * 0.1})`} 
                      stroke="#2563eb" 
                      strokeWidth="6"
                      strokeDasharray={`${personalValue * 30} 300`}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Unsafe</span>
                <span>Completely safe</span>
              </div>
              
              <Slider 
                defaultValue={[personalValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
            
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="relative h-40 flex items-center justify-center mb-4">
                {/* Shield visualization */}
                <div className="relative h-32 w-28">
                  <svg viewBox="0 0 100 120" className="h-full w-full">
                    <path 
                      d="M50,0 L100,30 L100,70 Q100,120 50,120 Q0,120 0,70 L0,30 Z" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="6"
                    />
                    <path 
                      d="M50,0 L100,30 L100,70 Q100,120 50,120 Q0,120 0,70 L0,30 Z" 
                      fill={`rgba(124, 58, 237, ${workValue * 0.1})`} 
                      stroke="#7c3aed" 
                      strokeWidth="6"
                      strokeDasharray={`${workValue * 30} 300`}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-violet-500" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Unsafe</span>
                <span>Completely safe</span>
              </div>
              
              <Slider 
                defaultValue={[workValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        );
      }
    },
    
    // Question 16: Alignment With Values (M)
    {
      id: "values_alignment",
      category: "M",
      text: "How aligned are your daily activities with your core values?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="relative h-40 flex items-center justify-center mb-4">
                {/* Value compass */}
                <div className="relative h-32 w-32 rounded-full border-2 border-gray-200">
                  {/* Background sectors for values */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-full flex flex-col">
                      <div className="h-1/2 flex">
                        <div className="w-1/2 bg-blue-50 rounded-tl-full"></div>
                        <div className="w-1/2 bg-green-50 rounded-tr-full"></div>
                      </div>
                      <div className="h-1/2 flex">
                        <div className="w-1/2 bg-amber-50 rounded-bl-full"></div>
                        <div className="w-1/2 bg-violet-50 rounded-br-full"></div>
                      </div>
                    </div>
                    
                    {/* Tiny value labels */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs">Connection</div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs">Growth</div>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs">Security</div>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs">Freedom</div>
                  </div>
                  
                  {/* Alignment indicator needle */}
                  <div 
                    className="absolute top-1/2 left-1/2 h-1 w-16 bg-blue-600 transform -translate-y-1/2 origin-left transition-transform duration-700"
                    style={{ transform: `translateX(-50%) rotate(${personalValue * 36}deg)` }}
                  ></div>
                  
                  <div className="absolute top-1/2 left-1/2 h-4 w-4 rounded-full bg-blue-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Value display */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 font-medium text-sm">
                    {personalValue}/10
                  </div>
                </div>
              </div>
              
              <Slider 
                defaultValue={[personalValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
            
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="relative h-40 flex items-center justify-center mb-4">
                {/* Value compass */}
                <div className="relative h-32 w-32 rounded-full border-2 border-gray-200">
                  {/* Background sectors for values */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-full flex flex-col">
                      <div className="h-1/2 flex">
                        <div className="w-1/2 bg-violet-50 rounded-tl-full"></div>
                        <div className="w-1/2 bg-green-50 rounded-tr-full"></div>
                      </div>
                      <div className="h-1/2 flex">
                        <div className="w-1/2 bg-amber-50 rounded-bl-full"></div>
                        <div className="w-1/2 bg-blue-50 rounded-br-full"></div>
                      </div>
                    </div>
                    
                    {/* Tiny value labels */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs">Innovation</div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs">Excellence</div>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs">Stability</div>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs">Collaboration</div>
                  </div>
                  
                  {/* Alignment indicator needle */}
                  <div 
                    className="absolute top-1/2 left-1/2 h-1 w-16 bg-violet-600 transform -translate-y-1/2 origin-left transition-transform duration-700"
                    style={{ transform: `translateX(-50%) rotate(${workValue * 36}deg)` }}
                  ></div>
                  
                  <div className="absolute top-1/2 left-1/2 h-4 w-4 rounded-full bg-violet-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Value display */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 font-medium text-sm">
                    {workValue}/10
                  </div>
                </div>
              </div>
              
              <Slider 
                defaultValue={[workValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        );
      }
    },
    
    // Question 17: Growth Mindset (A)
    {
      id: "growth_mindset",
      category: "A",
      text: "How much do you embrace challenges as opportunities to learn and grow?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="relative h-48 flex items-center justify-center mb-4">
                {/* Growth spiral visualization */}
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {/* Create a spiral path that grows with the value */}
                  <path 
                    d={`M 80 80 
                       Q ${80 + personalValue * 2} ${80 - personalValue * 3} ${80 + personalValue * 5} ${80 - personalValue * 1}
                       Q ${80 + personalValue * 8} ${80 + personalValue * 4} ${80 + personalValue * 3} ${80 + personalValue * 7}
                       Q ${80 - personalValue * 3} ${80 + personalValue * 10} ${80 - personalValue * 8} ${80 + personalValue * 5}
                       Q ${80 - personalValue * 13} ${80 - personalValue * 2} ${80 - personalValue * 6} ${80 - personalValue * 9}
                       Q ${80 + personalValue * 4} ${80 - personalValue * 16} ${80 + personalValue * 13} ${80 - personalValue * 10}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Small circles along the path representing growth points */}
                  <circle cx="80" cy="80" r="3" fill="#3b82f6" />
                  <circle cx={`${80 + personalValue * 5}`} cy={`${80 - personalValue * 1}`} r="3" fill="#3b82f6" />
                  <circle cx={`${80 + personalValue * 3}`} cy={`${80 + personalValue * 7}`} r="3" fill="#3b82f6" />
                  <circle cx={`${80 - personalValue * 8}`} cy={`${80 + personalValue * 5}`} r="3" fill="#3b82f6" />
                  <circle cx={`${80 - personalValue * 6}`} cy={`${80 - personalValue * 9}`} r="3" fill="#3b82f6" />
                  <circle cx={`${80 + personalValue * 13}`} cy={`${80 - personalValue * 10}`} r="5" fill="#3b82f6" />
                  
                  {/* Value indicator */}
                  <text x="75" y="85" fontSize="12" fill="#3b82f6" fontWeight="bold">{personalValue}</text>
                </svg>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Fixed mindset</span>
                <span>Growth mindset</span>
              </div>
              
              <Slider 
                defaultValue={[personalValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
            
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="relative h-48 flex items-center justify-center mb-4">
                {/* Growth spiral visualization */}
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {/* Create a spiral path that grows with the value */}
                  <path 
                    d={`M 80 80 
                       Q ${80 + workValue * 2} ${80 - workValue * 3} ${80 + workValue * 5} ${80 - workValue * 1}
                       Q ${80 + workValue * 8} ${80 + workValue * 4} ${80 + workValue * 3} ${80 + workValue * 7}
                       Q ${80 - workValue * 3} ${80 + workValue * 10} ${80 - workValue * 8} ${80 + workValue * 5}
                       Q ${80 - workValue * 13} ${80 - workValue * 2} ${80 - workValue * 6} ${80 - workValue * 9}
                       Q ${80 + workValue * 4} ${80 - workValue * 16} ${80 + workValue * 13} ${80 - workValue * 10}`}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Small circles along the path representing growth points */}
                  <circle cx="80" cy="80" r="3" fill="#7c3aed" />
                  <circle cx={`${80 + workValue * 5}`} cy={`${80 - workValue * 1}`} r="3" fill="#7c3aed" />
                  <circle cx={`${80 + workValue * 3}`} cy={`${80 + workValue * 7}`} r="3" fill="#7c3aed" />
                  <circle cx={`${80 - workValue * 8}`} cy={`${80 + workValue * 5}`} r="3" fill="#7c3aed" />
                  <circle cx={`${80 - workValue * 6}`} cy={`${80 - workValue * 9}`} r="3" fill="#7c3aed" />
                  <circle cx={`${80 + workValue * 13}`} cy={`${80 - workValue * 10}`} r="5" fill="#7c3aed" />
                  
                  {/* Value indicator */}
                  <text x="75" y="85" fontSize="12" fill="#7c3aed" fontWeight="bold">{workValue}</text>
                </svg>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Fixed mindset</span>
                <span>Growth mindset</span>
              </div>
              
              <Slider 
                defaultValue={[workValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        );
      }
    },
    
    // Question 18: Work-Life Balance (V)
    {
      id: "work_life_balance",
      category: "V",
      text: "How satisfied are you with your work-life balance?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="relative h-64 w-full border rounded-xl p-4">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Seesaw visualization */}
              <div className="relative w-80 h-2 bg-gray-300 rounded-full transition-transform duration-500"
                style={{ 
                  transform: `rotate(${(personalValue - workValue) * 3}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {/* Personal life side */}
                <div className="absolute -left-16 -top-24 w-32 h-20 bg-blue-100 border border-blue-300 rounded-lg flex flex-col items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm font-medium">Personal</span>
                  <span className="text-lg font-bold">{personalValue}/10</span>
                </div>
                
                {/* Work life side */}
                <div className="absolute -right-16 -top-24 w-32 h-20 bg-violet-100 border border-violet-300 rounded-lg flex flex-col items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-violet-600 mb-1" />
                  <span className="text-sm font-medium">Work</span>
                  <span className="text-lg font-bold">{workValue}/10</span>
                </div>
              </div>
              
              {/* Center support pillar */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-full w-4 h-16 bg-gray-400 rounded-t-lg"></div>
              
              {/* Base */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-500 rounded-lg"></div>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full grid grid-cols-2 gap-4 px-4">
              <div>
                <span className="block text-xs mb-1 text-blue-700">Personal Life Satisfaction</span>
                <Slider 
                  defaultValue={[personalValue]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
                />
              </div>
              
              <div>
                <span className="block text-xs mb-1 text-violet-700">Work Life Satisfaction</span>
                <Slider 
                  defaultValue={[workValue]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
                />
              </div>
            </div>
          </div>
        );
      }
    },
    
    // Question 19: Social Connection (P/R)
    {
      id: "social_connection",
      category: "R",
      text: "How connected do you feel to others around you?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="relative h-80 w-full border rounded-xl p-4">
            <div className="absolute top-3 left-0 w-full flex justify-between px-8">
              <div className="flex flex-col items-center">
                <HeartIcon className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Personal Connections</span>
              </div>
              
              <div className="flex flex-col items-center">
                <BriefcaseIcon className="h-6 w-6 text-violet-600" />
                <span className="text-sm">Work Connections</span>
              </div>
            </div>
            
            {/* Connection networks visualization */}
            <div className="absolute top-16 left-0 w-full flex justify-between px-8">
              <div className="relative h-40 w-40">
                {/* Personal connection network */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center border-2 border-blue-300 z-10">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                
                {/* Connection nodes based on value */}
                {Array.from({length: personalValue}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-blue-50 border border-blue-200 rounded-full h-8 w-8 flex items-center justify-center"
                    style={{
                      top: `${50 + Math.sin(i * (Math.PI * 2 / personalValue)) * 40}%`,
                      left: `${50 + Math.cos(i * (Math.PI * 2 / personalValue)) * 40}%`,
                    }}
                  >
                    <UserIcon className="h-4 w-4 text-blue-500" />
                  </div>
                ))}
                
                {/* Connection lines */}
                {Array.from({length: personalValue}).map((_, i) => (
                  <svg 
                    key={i} 
                    className="absolute top-0 left-0 h-full w-full"
                    style={{ zIndex: 0 }}
                  >
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2={`${50 + Math.cos(i * (Math.PI * 2 / personalValue)) * 40}%`} 
                      y2={`${50 + Math.sin(i * (Math.PI * 2 / personalValue)) * 40}%`} 
                      stroke="#93c5fd" 
                      strokeWidth="2" 
                    />
                  </svg>
                ))}
                
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                  {personalValue}/10
                </div>
              </div>
              
              <div className="relative h-40 w-40">
                {/* Work connection network */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-100 rounded-full h-12 w-12 flex items-center justify-center border-2 border-violet-300 z-10">
                  <UserIcon className="h-6 w-6 text-violet-600" />
                </div>
                
                {/* Connection nodes based on value */}
                {Array.from({length: workValue}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-violet-50 border border-violet-200 rounded-full h-8 w-8 flex items-center justify-center"
                    style={{
                      top: `${50 + Math.sin(i * (Math.PI * 2 / workValue)) * 40}%`,
                      left: `${50 + Math.cos(i * (Math.PI * 2 / workValue)) * 40}%`,
                    }}
                  >
                    <UserIcon className="h-4 w-4 text-violet-500" />
                  </div>
                ))}
                
                {/* Connection lines */}
                {Array.from({length: workValue}).map((_, i) => (
                  <svg 
                    key={i} 
                    className="absolute top-0 left-0 h-full w-full"
                    style={{ zIndex: 0 }}
                  >
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2={`${50 + Math.cos(i * (Math.PI * 2 / workValue)) * 40}%`} 
                      y2={`${50 + Math.sin(i * (Math.PI * 2 / workValue)) * 40}%`} 
                      stroke="#ddd6fe" 
                      strokeWidth="2" 
                    />
                  </svg>
                ))}
                
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                  {workValue}/10
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full grid grid-cols-2 gap-4 px-4">
              <div>
                <span className="block text-xs mb-1 text-blue-700">Personal Connections</span>
                <Slider 
                  defaultValue={[personalValue]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
                />
              </div>
              
              <div>
                <span className="block text-xs mb-1 text-violet-700">Work Connections</span>
                <Slider 
                  defaultValue={[workValue]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
                />
              </div>
            </div>
          </div>
        );
      }
    },
    
    // Question 20: Legacy & Impact (M/A)
    {
      id: "legacy_impact",
      category: "M",
      text: "How much lasting impact do you feel your efforts will have?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="relative h-48 flex items-center justify-center mb-4">
                {/* Tree visualization */}
                <div className="relative w-40 h-40">
                  {/* Tree trunk */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-amber-700 rounded-sm"></div>
                  
                  {/* Tree foliage - size based on value */}
                  <div 
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 rounded-full bg-green-500 transition-all duration-700"
                    style={{
                      width: `${personalValue * 8}px`,
                      height: `${personalValue * 8}px`,
                      opacity: 0.8
                    }}
                  ></div>
                  
                  {/* Value indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-8 font-medium">
                    {personalValue}/10
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Limited impact</span>
                <span>Lasting legacy</span>
              </div>
              
              <Slider 
                defaultValue={[personalValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
            
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="relative h-48 flex items-center justify-center mb-4">
                {/* Building visualization */}
                <div className="relative w-40 h-40">
                  {/* Building base */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-600 rounded-sm"></div>
                  
                  {/* Building structure - height based on value */}
                  <div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 bg-violet-500 transition-all duration-700"
                    style={{
                      height: `${workValue * 3}px`
                    }}
                  >
                    {/* Windows */}
                    {Array.from({length: Math.floor(workValue / 2)}).map((_, i) => (
                      <div key={i} className="absolute left-0 w-full flex justify-around" style={{ bottom: i * 10 + 5 }}>
                        <div className="h-3 w-3 bg-yellow-100"></div>
                        <div className="h-3 w-3 bg-yellow-100"></div>
                        <div className="h-3 w-3 bg-yellow-100"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Value indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-8 font-medium">
                    {workValue}/10
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Limited impact</span>
                <span>Lasting legacy</span>
              </div>
              
              <Slider 
                defaultValue={[workValue]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        );
      }
    },
  ];

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PERMA-V Assessment</h1>
          <p className="text-muted-foreground">
            Answer the following questions about your personal and work life
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round((currentQuestionIndex / (questions.length - 1)) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(currentQuestionIndex / (questions.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {currentQuestion.text}
          </h2>
          
          {/* Dynamic component based on question type */}
          <div className="mb-6">
            {currentQuestion.component({ questionId: currentQuestion.id })}
          </div>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={goToNextQuestion}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Complete Assessment
            </Button>
          )}
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </PageContainer>
  );
}