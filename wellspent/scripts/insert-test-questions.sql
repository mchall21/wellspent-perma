-- Only insert test questions if the table is empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM assessment_questions) = 0 THEN
        -- Insert test questions for each dimension
        
        -- Positive Emotion Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you feel joyful in your personal life?', 'positive_emotion', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you feel positive emotions at work?', 'positive_emotion', 'work');

        -- Update pair IDs for positive emotion questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you feel positive emotions at work?' LIMIT 1)
        WHERE question_text = 'How often do you feel joyful in your personal life?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you feel joyful in your personal life?' LIMIT 1)
        WHERE question_text = 'How often do you feel positive emotions at work?';

        -- Engagement Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you become completely absorbed in what you are doing in your personal life?', 'engagement', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you become completely absorbed in your work tasks?', 'engagement', 'work');

        -- Update pair IDs for engagement questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you become completely absorbed in your work tasks?' LIMIT 1)
        WHERE question_text = 'How often do you become completely absorbed in what you are doing in your personal life?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you become completely absorbed in what you are doing in your personal life?' LIMIT 1)
        WHERE question_text = 'How often do you become completely absorbed in your work tasks?';

        -- Relationships Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How satisfied are you with your personal relationships?', 'relationships', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How satisfied are you with your work relationships?', 'relationships', 'work');

        -- Update pair IDs for relationships questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How satisfied are you with your work relationships?' LIMIT 1)
        WHERE question_text = 'How satisfied are you with your personal relationships?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How satisfied are you with your personal relationships?' LIMIT 1)
        WHERE question_text = 'How satisfied are you with your work relationships?';

        -- Meaning Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How meaningful do you find your personal life?', 'meaning', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How meaningful do you find your work?', 'meaning', 'work');

        -- Update pair IDs for meaning questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How meaningful do you find your work?' LIMIT 1)
        WHERE question_text = 'How meaningful do you find your personal life?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How meaningful do you find your personal life?' LIMIT 1)
        WHERE question_text = 'How meaningful do you find your work?';

        -- Accomplishment Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you feel a sense of accomplishment in your personal life?', 'accomplishment', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How often do you feel a sense of accomplishment at work?', 'accomplishment', 'work');

        -- Update pair IDs for accomplishment questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you feel a sense of accomplishment at work?' LIMIT 1)
        WHERE question_text = 'How often do you feel a sense of accomplishment in your personal life?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How often do you feel a sense of accomplishment in your personal life?' LIMIT 1)
        WHERE question_text = 'How often do you feel a sense of accomplishment at work?';

        -- Vitality Questions
        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How energetic do you feel in your personal life?', 'vitality', 'personal');

        INSERT INTO assessment_questions (question_text, dimension, context) 
        VALUES ('How energetic do you feel at work?', 'vitality', 'work');

        -- Update pair IDs for vitality questions
        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How energetic do you feel at work?' LIMIT 1)
        WHERE question_text = 'How energetic do you feel in your personal life?';

        UPDATE assessment_questions 
        SET pair_id = (SELECT id FROM assessment_questions WHERE question_text = 'How energetic do you feel in your personal life?' LIMIT 1)
        WHERE question_text = 'How energetic do you feel at work?';
        
        RAISE NOTICE 'Test questions inserted successfully';
    ELSE
        RAISE NOTICE 'Table already contains questions, no test questions inserted';
    END IF;
END $$; 