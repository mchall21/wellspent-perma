export interface QuestionComponentProps {
  questionId: string;
  personalValue: number;
  workValue: number;
  onPersonalChange: (value: number) => void;
  onWorkChange: (value: number) => void;
  personalLabel: string;
  workLabel: string;
  scaleStart: number;
  scaleEnd: number;
  startLabel: string;
  endLabel: string;
  config: any;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  personal_context_label: string;
  work_context_label: string;
  scale_start: number;
  scale_end: number;
  scale_start_label: string;
  scale_end_label: string;
  question_order: number;
  active: boolean;
  component_type?: string;
  component_config?: any;
} 