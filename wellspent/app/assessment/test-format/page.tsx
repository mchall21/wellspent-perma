"use client";

import React, { useState } from "react";
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

// Define types for our component props and state
type Context = "personal" | "work";
type ResponseValue = number;
type Response = {
  [key: string]: {
    [context in Context]?: ResponseValue;
  };
};

// Define the props for question components
interface QuestionComponentProps {
  questionId: string;
}

// Define the question structure
interface Question {
  id: string;
  category: string;
  text: string;
  component: React.FC<QuestionComponentProps>;
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
    // Here you would send the data to your backend
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
            <div className="rounded-xl border p-5">
              <div className="flex items-center mb-4">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="relative h-40 mb-2">
                <div className="absolute bottom-0 w-full h-full overflow-hidden">
                  {/* Mountain shape with gradient */}
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-blue-200 to-blue-50" 
                       style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}></div>
                  
                  {/* Climber position based on value */}
                  <div 
                    className="absolute w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white transform -translate-x-1/2 transition-all duration-500"
                    style={{ 
                      bottom: `${personalValue * 10}%`, 
                      left: `${50 + personalValue * 2}%` 
                    }}
                  >
                    <span className="text-xs">😀</span>
                  </div>
                </div>
                
                {/* Scale markers */}
                <div className="absolute right-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
              </div>
              
              <Slider 
                defaultValue={[personalValue]} 
                max={10} 
                step={1}
                className="mt-6"
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
            
            <div className="rounded-xl border p-5">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="relative h-40 mb-2">
                <div className="absolute bottom-0 w-full h-full overflow-hidden">
                  {/* Mountain shape with gradient */}
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-violet-200 to-violet-50" 
                       style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}></div>
                  
                  {/* Climber position based on value */}
                  <div 
                    className="absolute w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white transform -translate-x-1/2 transition-all duration-500"
                    style={{ 
                      bottom: `${workValue * 10}%`, 
                      left: `${50 + workValue * 2}%` 
                    }}
                  >
                    <span className="text-xs">😀</span>
                  </div>
                </div>
                
                {/* Scale markers */}
                <div className="absolute right-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
              </div>
              
              <Slider 
                defaultValue={[workValue]} 
                max={10} 
                step={1}
                className="mt-6"
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        );
      }
    },
    
    // ENGAGEMENT (E)
    // Question 3: Flow Experience
    {
      id: "flow",
      category: "E",
      text: "How often do you lose track of time because you're completely absorbed in what you're doing?",
      component: ({ questionId }: QuestionComponentProps) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4">
            <div className="flex items-center mb-3">
              <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium">Personal Life</span>
            </div>
            
            <div className="space-y-5">
              <div className="relative h-8">
                <div className="absolute w-full h-2 bg-gray-200 rounded-full top-3"></div>
                
                <div className="absolute flex justify-between w-full top-0">
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-red-400" style={{ animationDuration: '10s', animationName: 'spin', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                    <span className="text-xs mt-1">Time drags</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-amber-400" />
                    <span className="text-xs mt-1">Normal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-green-400" style={{ animationDuration: '2s', animationName: 'spin', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                    <span className="text-xs mt-1">Time flies</span>
                  </div>
                </div>
              </div>
              
              <Slider 
                defaultValue={[getValue(questionId, "personal")]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
              />
            </div>
          </div>
          
          <div className="rounded-xl border p-4">
            <div className="flex items-center mb-3">
              <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
              <span className="font-medium">Work Life</span>
            </div>
            
            <div className="space-y-5">
              <div className="relative h-8">
                <div className="absolute w-full h-2 bg-gray-200 rounded-full top-3"></div>
                
                <div className="absolute flex justify-between w-full top-0">
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-red-400" style={{ animationDuration: '10s', animationName: 'spin', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                    <span className="text-xs mt-1">Time drags</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-amber-400" />
                    <span className="text-xs mt-1">Normal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 text-green-400" style={{ animationDuration: '2s', animationName: 'spin', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                    <span className="text-xs mt-1">Time flies</span>
                  </div>
                </div>
              </div>
              
              <Slider 
                defaultValue={[getValue(questionId, "work")]} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
              />
            </div>
          </div>
        </div>
      )
    },
    
    // Question 4: Absorbed Interest
    {
      id: "absorbed_interest",
      category: "E",
      text: "When doing activities, how deeply engaged do you typically become?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-4">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Life</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Easily distracted</span>
                  <span>Completely immersed</span>
                </div>
                
                <div className="relative h-20 border rounded-lg overflow-hidden">
                  {/* Water fill animation */}
                  <div 
                    className="absolute bottom-0 w-full bg-blue-400 transition-all duration-700"
                    style={{ height: `${personalValue * 10}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-3 bg-blue-300 opacity-30" style={{ animationName: 'wave', animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                  </div>
                  
                  {/* Value indicator */}
                  <div className="absolute right-2 top-2 bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium shadow">
                    {personalValue}
                  </div>
                </div>
                
                <Slider 
                  defaultValue={[personalValue]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
                />
              </div>
            </div>
            
            <div className="rounded-xl border p-4">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-medium">Work Life</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Easily distracted</span>
                  <span>Completely immersed</span>
                </div>
                
                <div className="relative h-20 border rounded-lg overflow-hidden">
                  {/* Water fill animation */}
                  <div 
                    className="absolute bottom-0 w-full bg-violet-400 transition-all duration-700"
                    style={{ height: `${workValue * 10}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-3 bg-violet-300 opacity-30" style={{ animationName: 'wave', animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                  </div>
                  
                  {/* Value indicator */}
                  <div className="absolute right-2 top-2 bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium shadow">
                    {workValue}
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
          </div>
        );
      }
    },
    
    // RELATIONSHIPS (R)
    // Question 5: Social Support
    {
      id: "social_support",
      category: "R",
      text: "How supported do you feel by the people around you?",
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
              
              <div className="relative h-32 mb-4">
                {/* Central figure */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 border-2 border-blue-400 rounded-full h-10 w-10 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                
                {/* Support network - circles that appear based on value */}
                {Array.from({length: personalValue}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-blue-50 border border-blue-200 rounded-full h-6 w-6 flex items-center justify-center"
                    style={{
                      top: `${50 + Math.sin(i * 1.5) * (20 + i * 2)}%`,
                      left: `${50 + Math.cos(i * 1.5) * (20 + i * 2)}%`,
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <UserIcon className="h-3 w-3 text-blue-500" />
                  </div>
                ))}
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
              
              <div className="relative h-32 mb-4">
                {/* Central figure */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-100 border-2 border-violet-400 rounded-full h-10 w-10 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-violet-600" />
                </div>
                
                {/* Support network - circles that appear based on value */}
                {Array.from({length: workValue}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-violet-50 border border-violet-200 rounded-full h-6 w-6 flex items-center justify-center"
                    style={{
                      top: `${50 + Math.sin(i * 1.5) * (20 + i * 2)}%`,
                      left: `${50 + Math.cos(i * 1.5) * (20 + i * 2)}%`,
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <UserIcon className="h-3 w-3 text-violet-500" />
                  </div>
                ))}
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
    
    // Question 6: Connection Quality
    {
      id: "connection_quality",
      category: "R",
      text: "How strong are your connections with the important people in your life?",
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
              
              <div className="py-3 mb-2">
                {/* Connection strength visualization */}
                <div className="relative h-14 flex items-center justify-center">
                  <div className="absolute left-4">
                    <UserIcon className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
                  </div>
                  
                  <div className="absolute right-4">
                    <UsersIcon className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
                  </div>
                  
                  {/* Connection lines */}
                  <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full" style={{ width: `${personalValue * 8}%` }}></div>
                  
                  {/* Value indicator */}
                  <div className="absolute bg-white border shadow-sm rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                    {personalValue}
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Distant</span>
                  <span>Close</span>
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
              
              <div className="py-3 mb-2">
                {/* Connection strength visualization */}
                <div className="relative h-14 flex items-center justify-center">
                  <div className="absolute left-4">
                    <UserIcon className="h-10 w-10 text-violet-600 bg-violet-100 p-2 rounded-full" />
                  </div>
                  
                  <div className="absolute right-4">
                    <UsersIcon className="h-10 w-10 text-violet-600 bg-violet-100 p-2 rounded-full" />
                  </div>
                  
                  {/* Connection lines */}
                  <div className="h-1 bg-gradient-to-r from-violet-300 to-violet-600 rounded-full" style={{ width: `${workValue * 8}%` }}></div>
                  
                  {/* Value indicator */}
                  <div className="absolute bg-white border shadow-sm rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                    {workValue}
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Distant</span>
                  <span>Close</span>
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
    
    // MEANING (M)
    // Question 7: Purpose
    {
      id: "purpose",
      category: "M",
      text: "How clear is your sense of purpose and direction?",
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
                {/* Compass visualization */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                  {/* Direction needle - rotates based on value */}
                  <div 
                    className="absolute h-1 w-16 bg-gradient-to-r from-red-500 to-blue-600 origin-center transition-transform duration-700"
                    style={{ transform: `rotate(${personalValue * 36 - 180}deg)` }}
                  ></div>
                  
                  {/* Compass markings */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium">N</div>
                  <div className="absolute right-1 top-1/2 transform translate-y-1/2 text-xs font-medium">E</div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-xs font-medium">S</div>
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-medium">W</div>
                  
                  <div className="text-lg font-bold">{personalValue}</div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Uncertain</span>
                <span>Clear direction</span>
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
                {/* Compass visualization */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                  {/* Direction needle - rotates based on value */}
                  <div 
                    className="absolute h-1 w-16 bg-gradient-to-r from-red-500 to-violet-600 origin-center transition-transform duration-700"
                    style={{ transform: `rotate(${workValue * 36 - 180}deg)` }}
                  ></div>
                  
                  {/* Compass markings */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium">N</div>
                  <div className="absolute right-1 top-1/2 transform translate-y-1/2 text-xs font-medium">E</div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-xs font-medium">S</div>
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-medium">W</div>
                  
                  <div className="text-lg font-bold">{workValue}</div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Uncertain</span>
                <span>Clear direction</span>
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
    
    // Question 8: Contribution Value
    {
      id: "contribution_value",
      category: "M",
      text: "How much do you feel what you do matters and makes a difference?",
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
              
              <div className="relative h-40 flex items-center justify-center mb-2">
                {/* Ripple effect animation */}
                <div className="relative">
                  {/* Center point */}
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    You
                  </div>
                  
                  {/* Ripples based on value */}
                  {Array.from({length: personalValue}).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full border border-blue-400 opacity-70"
                      style={{
                        top: `-${(i+1) * 5}px`,
                        left: `-${(i+1) * 5}px`,
                        width: `${8 + (i+1) * 10}px`,
                        height: `${8 + (i+1) * 10}px`,
                        animation: 'ripple 2s infinite',
                        animationDelay: `${i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Minimal impact</span>
                <span>Significant impact</span>
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
              
              <div className="relative h-40 flex items-center justify-center mb-2">
                {/* Ripple effect animation */}
                <div className="relative">
                  {/* Center point */}
                  <div className="h-8 w-8 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs">
                    You
                  </div>
                  
                  {/* Ripples based on value */}
                  {Array.from({length: workValue}).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full border border-violet-400 opacity-70"
                      style={{
                        top: `-${(i+1) * 5}px`,
                        left: `-${(i+1) * 5}px`,
                        width: `${8 + (i+1) * 10}px`,
                        height: `${8 + (i+1) * 10}px`,
                        animation: 'ripple 2s infinite',
                        animationDelay: `${i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Minimal impact</span>
                <span>Significant impact</span>
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
    
    // ACCOMPLISHMENT (A)
    // Question 9: Goal Achievement
    {
      id: "goal_achievement",
      category: "A",
      text: "How often do you achieve the important goals you set for yourself?",
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
              
              <div className="relative h-24 mb-4">
                {/* Mountain path with checkpoints */}
                <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>
                
                {/* Progress line */}
                <div 
                  className="absolute bottom-0 h-1 bg-green-500 transition-all duration-500"
                  style={{ width: `${personalValue * 10}%` }}
                ></div>
                
                {/* Flagpole markers */}
                {[2, 4, 6, 8, 10].map(checkpoint => (
                  <div 
                    key={checkpoint}
                    className="absolute bottom-0 transform -translate-x-1/2"
                    style={{ left: `${checkpoint * 10}%` }}
                  >
                    <div className="h-4 w-1 bg-gray-300"></div>
                    <div 
                      className={`absolute top-0 w-3 h-2 transition-colors duration-300 ${personalValue >= checkpoint ? 'bg-green-500' : 'bg-gray-200'}`}
                      style={{ left: '-1px' }}
                    ></div>
                  </div>
                ))}
                
                {/* Climber figure */}
                <div 
                  className="absolute bottom-2 transform -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${personalValue * 10}%` }}
                >
                  <span className="text-lg">🧗</span>
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
              
              <div className="relative h-24 mb-4">
                {/* Mountain path with checkpoints */}
                <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>
                
                {/* Progress line */}
                <div 
                  className="absolute bottom-0 h-1 bg-green-500 transition-all duration-500"
                  style={{ width: `${workValue * 10}%` }}
                ></div>
                
                {/* Flagpole markers */}
                {[2, 4, 6, 8, 10].map(checkpoint => (
                  <div 
                    key={checkpoint}
                    className="absolute bottom-0 transform -translate-x-1/2"
                    style={{ left: `${checkpoint * 10}%` }}
                  >
                    <div className="h-4 w-1 bg-gray-300"></div>
                    <div 
                      className={`absolute top-0 w-3 h-2 transition-colors duration-300 ${workValue >= checkpoint ? 'bg-green-500' : 'bg-gray-200'}`}
                      style={{ left: '-1px' }}
                    ></div>
                  </div>
                ))}
                
                {/* Climber figure */}
                <div 
                  className="absolute bottom-2 transform -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${workValue * 10}%` }}
                >
                  <span className="text-lg">🧗</span>
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
    
    // Question 10: Competence
    {
      id: "competence",
      category: "A",
      text: "How competent do you feel in the activities that are important to you?",
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
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Beginner</span>
                  <span className="text-sm">Expert</span>
                </div>
                
                {/* Skill level meters for different areas */}
                <div className="space-y-2">
                  {["Relationships", "Hobbies", "Life Management"].map(skill => (
                    <div key={skill} className="flex items-center">
                      <span className="w-24 text-xs">{skill}</span>
                      <div className="relative flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${personalValue * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Beginner</span>
                  <span className="text-sm">Expert</span>
                </div>
                
                {/* Skill level meters for different areas */}
                <div className="space-y-2">
                  {["Technical", "Communication", "Leadership"].map(skill => (
                    <div key={skill} className="flex items-center">
                      <span className="w-24 text-xs">{skill}</span>
                      <div className="relative flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-500"
                          style={{ width: `${workValue * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
    
    // VITALITY (V)
    // Question 11: Energy Levels
    {
      id: "energy_levels",
      category: "V",
      text: "How would you rate your energy levels throughout a typical day?",
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
              
              <div className="flex justify-center mb-4">
                {/* Battery visualization */}
                <div className="relative w-20 h-36 border-2 border-gray-300 rounded-lg overflow-hidden">
                  {/* Battery bump */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-3 bg-gray-300 rounded-t-sm"></div>
                  
                  {/* Battery fill */}
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-700 ease-out"
                    style={{ 
                      height: `${personalValue * 10}%`,
                      backgroundColor: personalValue > 7 ? '#4ade80' : personalValue > 4 ? '#facc15' : '#ef4444'
                    }}
                  ></div>
                  
                  {/* Battery level indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg">{personalValue}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Drained</span>
                <span>Energized</span>
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
              
              <div className="flex justify-center mb-4">
                {/* Battery visualization */}
                <div className="relative w-20 h-36 border-2 border-gray-300 rounded-lg overflow-hidden">
                  {/* Battery bump */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-3 bg-gray-300 rounded-t-sm"></div>
                  
                  {/* Battery fill */}
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-700 ease-out"
                    style={{ 
                      height: `${workValue * 10}%`,
                      backgroundColor: workValue > 7 ? '#4ade80' : workValue > 4 ? '#facc15' : '#ef4444'
                    }}
                  ></div>
                  
                  {/* Battery level indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg">{workValue}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Drained</span>
                <span>Energized</span>
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
    
    // Question 12: Physical Well-being
    {
      id: "physical_wellbeing",
      category: "V",
      text: "How satisfied are you with your physical health and well-being?",
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
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Mini health gauges */}
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="10"
                        strokeDasharray={`${personalValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="heart" className="text-lg">❤️</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Heart</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="10"
                        strokeDasharray={`${personalValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="strength" className="text-lg">💪</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Strength</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="10"
                        strokeDasharray={`${personalValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="sleep" className="text-lg">😴</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Sleep</span>
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
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Mini health gauges */}
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="10"
                        strokeDasharray={`${workValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="focus" className="text-lg">🧠</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Focus</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="10"
                        strokeDasharray={`${workValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="stamina" className="text-lg">⚡</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Stamina</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="10"
                        strokeDasharray={`${workValue * 28.3} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span role="img" aria-label="recovery" className="text-lg">🔄</span>
                    </div>
                  </div>
                  <span className="text-xs mt-1">Recovery</span>
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
    
    // COMBINATION QUESTIONS - COMPARING DOMAINS
    // Question 13: Gratitude (P)
    {
      id: "gratitude",
      category: "P",
      text: "How often do you feel grateful for aspects of your life?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="relative h-64 w-full border rounded-xl p-4">
            <div className="absolute top-3 left-0 w-full flex justify-center">
              <div className="font-medium">Balance of Gratitude</div>
            </div>
            
            <div className="absolute top-12 left-0 w-full flex justify-between px-6">
              <div className="flex flex-col items-center">
                <HeartIcon className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Personal Life</span>
              </div>
              
              <div className="flex flex-col items-center">
                <BriefcaseIcon className="h-6 w-6 text-violet-600" />
                <span className="text-sm">Work Life</span>
              </div>
            </div>
            
            {/* Balance scale visualization */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-2 w-40 bg-gray-300 rounded-full transition-transform duration-500"
                style={{ 
                  transform: `rotate(${(personalValue - workValue) * 3}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div className="absolute -left-12 -top-10 h-20 w-20 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{personalValue}</span>
                </div>
                
                <div className="absolute -right-12 -top-10 h-20 w-20 bg-violet-100 border border-violet-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{workValue}</span>
                </div>
              </div>
              
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-20 w-2 bg-gray-400 rounded-full"></div>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full grid grid-cols-2 gap-4 px-4">
              <div>
                <span className="block text-xs mb-1 text-blue-700">Personal Life</span>
                <Slider 
                  defaultValue={[personalValue]} 
                  max={10} 
                  step={1}
                  className="mb-2"
                  onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
                />
              </div>
              
              <div>
                <span className="block text-xs mb-1 text-violet-700">Work Life</span>
                <Slider 
                  defaultValue={[workValue]} 
                  max={10} 
                  step={1}
                  className="mb-2"
                  onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
                />
              </div>
            </div>
          </div>
        );
      }
    },
    
    // Question 14: Challenge & Skill Match (E)
    {
      id: "flow_channel",
      category: "E",
      text: "How well do your challenges match your skills and abilities?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalSkill = getValue(questionId, "personal");
        const workSkill = getValue(questionId, "work");
        const personalChallenge = getValue(questionId + "_challenge", "personal");
        const workChallenge = getValue(questionId + "_challenge", "work");
        
        return (
          <div className="relative h-80 w-full border rounded-xl p-4">
            {/* Flow diagram background */}
            <div className="absolute inset-16 bg-gradient-to-tr from-red-100 via-yellow-50 to-green-100 rounded-lg">
              {/* Anxiety zone */}
              <div className="absolute top-2 left-2 text-xs text-red-500">Anxiety</div>
              
              {/* Flow zone - diagonal channel */}
              <div className="absolute top-1/2 left-0 w-full h-16 bg-green-200 opacity-40 transform -translate-y-1/2 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-green-700">Flow</div>
              
              {/* Boredom zone */}
              <div className="absolute bottom-2 right-2 text-xs text-amber-500">Boredom</div>
              
              {/* Axes labels */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs">Challenge Level</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 text-xs">Skill Level</div>
            </div>
            
            {/* Personal marker */}
            <div 
              className="absolute h-8 w-8 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-md transition-all duration-500 z-10"
              style={{ 
                left: `${personalSkill * 8 + 10}%`, 
                top: `${100 - (personalChallenge * 8 + 10)}%` 
              }}
            >
              <HeartIcon className="h-4 w-4 text-blue-600" />
            </div>
            
            {/* Work marker */}
            <div 
              className="absolute h-8 w-8 bg-violet-100 border-2 border-violet-500 rounded-full flex items-center justify-center shadow-md transition-all duration-500 z-10"
              style={{ 
                left: `${workSkill * 8 + 10}%`, 
                top: `${100 - (workChallenge * 8 + 10)}%` 
              }}
            >
              <BriefcaseIcon className="h-4 w-4 text-violet-600" />
            </div>
            
            <div className="absolute bottom-4 left-0 w-full grid grid-cols-2 gap-4 px-4">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs mb-1 text-blue-700">Personal Life - Skills</span>
                  <Slider 
                    defaultValue={[personalSkill]} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => handleValueChange(questionId, "personal", value[0])}
                  />
                </div>
                
                <div>
                  <span className="block text-xs mb-1 text-blue-700">Personal Life - Challenges</span>
                  <Slider 
                    defaultValue={[personalChallenge]} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => handleValueChange(questionId + "_challenge", "personal", value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-xs mb-1 text-violet-700">Work Life - Skills</span>
                  <Slider 
                    defaultValue={[workSkill]} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => handleValueChange(questionId, "work", value[0])}
                  />
                </div>
                
                <div>
                  <span className="block text-xs mb-1 text-violet-700">Work Life - Challenges</span>
                  <Slider 
                    defaultValue={[workChallenge]} 
                    max={10} 
                    step={1}
                    onValueChange={(value) => handleValueChange(questionId + "_challenge", "work", value[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
    },
    
    // Question 15: Trust & Psychological Safety (R)
    {
      id: "psychological_safety",
      category: "R",
      text: "How safe do you feel being your authentic self with others?",
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
    
    // Question 20: Lasting Impact
    {
      id: "lasting_impact",
      category: "M",
      text: "How much lasting impact do you feel your efforts will have?",
      component: ({ questionId }: QuestionComponentProps) => {
        const personalValue = getValue(questionId, "personal");
        const workValue = getValue(questionId, "work");
        
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">How much lasting impact do you feel your efforts will have?</h3>
            
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
                  {/* Tree visualization */}
                  <div className="relative w-40 h-40">
                    {/* Tree trunk */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-amber-700 rounded-sm"></div>
                    
                    {/* Tree foliage - size based on value */}
                    <div 
                      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 rounded-full bg-green-500 transition-all duration-700"
                      style={{
                        width: `${workValue * 8}px`,
                        height: `${workValue * 8}px`,
                        opacity: 0.8
                      }}
                    ></div>
                    
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
          </div>
        );
      }
    }
    // ... end of questions array
  ];

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Assessment Questions</h2>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-medium mb-6">{questions[currentQuestionIndex].text}</h3>
          {React.createElement(questions[currentQuestionIndex].component, { 
            questionId: questions[currentQuestionIndex].id 
          })}
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={goToNextQuestion}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Assessment</Button>
          )}
        </div>
      </div>
    </div>
  );
}
