import React from "react";
import { HeartIcon, BriefcaseIcon, ClockIcon, UsersIcon, Compass, 
         TrophyIcon, ActivityIcon, LightbulbIcon } from "lucide-react";
import { EnhancedSlider } from "./enhanced-slider";

// Types to match our database schema
interface QuestionProps {
  id: string;
  text: string;
  category: string;
  personal_context_label: string;
  work_context_label: string;
  scale_start: number;
  scale_end: number;
  scale_start_label: string;
  scale_end_label: string;
  personal_value: number;
  work_value: number;
  onValueChange: (context: "personal" | "work", value: number) => void;
}

// The standard question renderer with enhanced sliders
export function StandardQuestionRenderer({
  id,
  text,
  category,
  personal_context_label,
  work_context_label,
  scale_start,
  scale_end,
  scale_start_label,
  scale_end_label,
  personal_value,
  work_value,
  onValueChange
}: QuestionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center mb-4">
          <HeartIcon className="mr-2 h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">{personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={personal_value}
          min={scale_start}
          max={scale_end}
          startLabel={scale_start_label}
          endLabel={scale_end_label}
          colorScheme="blue"
          onValueChange={(value) => onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-violet-50 to-violet-100">
        <div className="flex items-center mb-4">
          <BriefcaseIcon className="mr-2 h-5 w-5 text-violet-600" />
          <span className="font-medium text-violet-800">{work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={work_value}
          min={scale_start}
          max={scale_end}
          startLabel={scale_start_label}
          endLabel={scale_end_label}
          colorScheme="violet"
          onValueChange={(value) => onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// P - Positive Emotions Renderer
export function PositiveEmotionsRenderer(props: QuestionProps) {
  const emotionEmojis = {
    startEmoji: "😔",
    endEmoji: "😊"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-rose-50 to-pink-100">
        <div className="flex items-center mb-4">
          <HeartIcon className="mr-2 h-5 w-5 text-pink-600" />
          <span className="font-medium text-pink-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={emotionEmojis.startEmoji}
          endEmoji={emotionEmojis.endEmoji}
          colorScheme="red"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-fuchsia-50 to-pink-100">
        <div className="flex items-center mb-4">
          <BriefcaseIcon className="mr-2 h-5 w-5 text-fuchsia-600" />
          <span className="font-medium text-fuchsia-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={emotionEmojis.startEmoji}
          endEmoji={emotionEmojis.endEmoji}
          colorScheme="red"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// E - Engagement Renderer
export function EngagementRenderer(props: QuestionProps) {
  const flowEmojis = {
    startEmoji: "⏱️",
    endEmoji: "⏳"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-amber-50 to-yellow-100">
        <div className="flex items-center mb-4">
          <ClockIcon className="mr-2 h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={flowEmojis.startEmoji}
          endEmoji={flowEmojis.endEmoji}
          colorScheme="amber"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-orange-50 to-amber-100">
        <div className="flex items-center mb-4">
          <BriefcaseIcon className="mr-2 h-5 w-5 text-orange-600" />
          <span className="font-medium text-orange-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={flowEmojis.startEmoji}
          endEmoji={flowEmojis.endEmoji}
          colorScheme="amber"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// R - Relationships Renderer
export function RelationshipsRenderer(props: QuestionProps) {
  const relationshipEmojis = {
    startEmoji: "🧍",
    endEmoji: "👫"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-purple-50 to-indigo-100">
        <div className="flex items-center mb-4">
          <UsersIcon className="mr-2 h-5 w-5 text-indigo-600" />
          <span className="font-medium text-indigo-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={relationshipEmojis.startEmoji}
          endEmoji={relationshipEmojis.endEmoji}
          colorScheme="violet"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="flex items-center mb-4">
          <UsersIcon className="mr-2 h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={relationshipEmojis.startEmoji}
          endEmoji={relationshipEmojis.endEmoji}
          colorScheme="blue"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// M - Meaning Renderer
export function MeaningRenderer(props: QuestionProps) {
  const meaningEmojis = {
    startEmoji: "❓",
    endEmoji: "🧭"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-emerald-50 to-teal-100">
        <div className="flex items-center mb-4">
          <Compass className="mr-2 h-5 w-5 text-emerald-600" />
          <span className="font-medium text-emerald-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={meaningEmojis.startEmoji}
          endEmoji={meaningEmojis.endEmoji}
          colorScheme="green"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="flex items-center mb-4">
          <Compass className="mr-2 h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={meaningEmojis.startEmoji}
          endEmoji={meaningEmojis.endEmoji}
          colorScheme="green"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// A - Accomplishment Renderer
export function AccomplishmentRenderer(props: QuestionProps) {
  const achievementEmojis = {
    startEmoji: "📉",
    endEmoji: "🏆"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-blue-50 to-sky-100">
        <div className="flex items-center mb-4">
          <TrophyIcon className="mr-2 h-5 w-5 text-sky-600" />
          <span className="font-medium text-sky-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={achievementEmojis.startEmoji}
          endEmoji={achievementEmojis.endEmoji}
          colorScheme="blue"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-cyan-50 to-sky-100">
        <div className="flex items-center mb-4">
          <TrophyIcon className="mr-2 h-5 w-5 text-cyan-600" />
          <span className="font-medium text-cyan-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={achievementEmojis.startEmoji}
          endEmoji={achievementEmojis.endEmoji}
          colorScheme="blue"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// V - Vitality Renderer
export function VitalityRenderer(props: QuestionProps) {
  const vitalityEmojis = {
    startEmoji: "🔋",
    endEmoji: "⚡"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-lime-50 to-green-100">
        <div className="flex items-center mb-4">
          <ActivityIcon className="mr-2 h-5 w-5 text-lime-600" />
          <span className="font-medium text-lime-800">{props.personal_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.personal_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={vitalityEmojis.startEmoji}
          endEmoji={vitalityEmojis.endEmoji}
          colorScheme="green"
          onValueChange={(value) => props.onValueChange("personal", value)}
        />
      </div>
      
      {/* Work Context */}
      <div className="rounded-xl border p-4 bg-gradient-to-r from-green-50 to-lime-100">
        <div className="flex items-center mb-4">
          <ActivityIcon className="mr-2 h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">{props.work_context_label}</span>
        </div>
        
        <EnhancedSlider
          value={props.work_value}
          min={props.scale_start}
          max={props.scale_end}
          startLabel={props.scale_start_label}
          endLabel={props.scale_end_label}
          startEmoji={vitalityEmojis.startEmoji}
          endEmoji={vitalityEmojis.endEmoji}
          colorScheme="green"
          onValueChange={(value) => props.onValueChange("work", value)}
        />
      </div>
    </div>
  );
}

// Category-specific question renderer
export function getCategoryRenderer(category: string) {
  switch (category) {
    case 'P':
      return PositiveEmotionsRenderer;
    case 'E':
      return EngagementRenderer;
    case 'R':
      return RelationshipsRenderer;
    case 'M':
      return MeaningRenderer;
    case 'A':
      return AccomplishmentRenderer;
    case 'V':
      return VitalityRenderer;
    default:
      return StandardQuestionRenderer;
  }
} 