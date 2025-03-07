import { supabase } from "@/lib/supabase";

export async function getQuestions() {
  const { data, error } = await supabase
    .from('assessment_questions')
    .select('*, component_type, component_config')
    .eq('active', true)
    .order('question_order');
    
  if (error) throw error;
  
  // Process JSON configs if needed
  return data.map(question => ({
    ...question,
    component_config: question.component_config 
      ? (typeof question.component_config === 'string'
         ? JSON.parse(question.component_config)
         : question.component_config)
      : {}
  }));
} 